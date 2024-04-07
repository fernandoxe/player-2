import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../controls';
import '../reactions';
import { ReactionI } from '../../interfaces';
import { generateReaction } from '../../services';

@customElement('pl-video')
export class Video extends LitElement {
  static styles = css`
    .container {
      position: relative;
      width: 100%;
      /* padding-top: 56.25%; */
    }
    .video {
      width: 100%;
      display: block;
    }
    .controls {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
    .reactions {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  `;

  @state()
  private paused = true;

  @state()
  private fullscreen = false;

  @state()
  private currentTime = 0;

  @state()
  private duration = 0;

  @state()
  private showControls = false;

  @state()
  private timer = 0;

  @state()
  private subtitles: {language: string, label: string, showing: boolean}[] = [];

  @state()
  private reactions: ReactionI[] = [];

  @property()
  id = '';

  @query('.video')
  video!: HTMLVideoElement;

  render() {
    return html`
      <div
        class="container"
        @mousemove="${this.handleMouseMove}"
      >
        <video
          class="video"
          muted
          @timeupdate="${this.handleTimeUpdate}"
          @loadedmetadata="${this.handleLoadedMetadata}"
          @playing="${this.handlePlayng}"
        >
          <source src="${`/${this.id}.mp4`}" type="video/mp4">
          <track kind="captions" src="${`/media/${this.id}.en.vtt`}" srclang="en" label="English" default>
          <track kind="captions" src="${`/media/${this.id}.es.vtt`}" srclang="es" label="Spanish">
        </video>
        <div class="reactions">
          <pl-reactions
            .reactions=${this.reactions}
          ></pl-reactions>
        </div>
        ${this.showControls ? html`
          <div class="controls">
            <pl-controls
              ?paused="${this.paused}"
              .currentTime="${this.currentTime}"
              .duration="${this.duration}"
              @onplay="${this.handlePlay}"
              ?fullscreen="${this.fullscreen}"
              @onfullscreen="${this.handleFullscreen}"
              .subtitles=${this.subtitles}
              @onsubtitle="${this.handleSubtitles}"
              @onchange="${this.handleProgressChange}"
              @oninput="${this.handleProgressInput}"
              @onreaction="${this.handleReaction}"
              @onback="${this.handleBack}"
              @onforward="${this.handleForward}"
            ></pl-controls>
          </div>
        ` : html``}
      </div>
    `;
  };

  handlePlay() {
    if (this.video?.paused) {
      this.video?.play();
      this.paused = false;
    } else {
      this.video?.pause();
      this.paused = true;
    }
  }

  handleTimeUpdate() {
    this.currentTime = this.video.currentTime;
  }

  handleLoadedMetadata() {
    this.duration = this.video.duration; this.video.currentTime = 7;
    const tracks = this.video.textTracks || [];
    this.subtitles = Array.from(tracks)
      .map(track => ({
        language: track.language,
        label: track.label,
        showing: track.mode === 'showing',
      }));
  }

  handleMouseMove() {
    this.showControls = true;
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.showControls = false;
    }, 2000);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      this.handlePlay();
    } else if (event.key === 'Enter') {
      this.handleFullscreen();
    }
  }

  handleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.fullscreen = false;
    } else {
      this.requestFullscreen({navigationUI: 'hide'});
      this.fullscreen = true;
    }
  }

  handleSubtitles(e: CustomEvent) {
    const tracks = this.video.textTracks;
    const newSubtitles = this.subtitles.map(subtitle => ({...subtitle}));
    for (let i = 0; i < tracks.length; i++) {
      if (i !== e.detail.index) {
        tracks[i].mode = 'hidden';
        newSubtitles[i].showing = false;
      }
    }
    const track = tracks[e.detail.index];
    track.mode = 'showing';
    newSubtitles[e.detail.index].showing = true;
    this.subtitles = newSubtitles;
  }

  handleProgressChange(e: CustomEvent) {
    // console.log('change', e.detail.value);
    this.video.currentTime = e.detail.value;
    this.currentTime = this.video.currentTime;
  }

  handleProgressInput(e: CustomEvent) {
    // console.log('input', e.detail.value);
    this.video.currentTime = e.detail.value;
    this.currentTime = this.video.currentTime;
  }

  handleReaction(e: CustomEvent) {
    const reaction: ReactionI = generateReaction(e.detail.reaction, 'user');
    const newReactions = [...this.reactions.slice(-19).map(r => ({...r})), reaction];
    this.reactions = newReactions;
    // console.log('reaction', e.detail.reaction, this.reactions);
  }

  handleBack() {
    this.video.currentTime -= 5;
  }

  handleForward() {
    this.video.currentTime += 5;
  }

  handlePlayng() {
    console.log('playing');
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}
