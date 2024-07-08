import { LitElement, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import '../controls';
import '../reactions';
import { ConnectionStatus, ReactionI, UserI } from '../../interfaces';
import { generateReaction } from '../../services';
import '../modal';
import '../user';
import { Socket, io } from 'socket.io-client';
import '../users';
import '../loader';
import '../synchronize';
import { WS_HOST, WS_PATH } from '../constants';

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
      max-height: 100vh;
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
    .users {
      position: absolute;
      top: 0;
      right: 0;
      max-height: 50%;
      overflow-y: scroll;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.0), rgba(95, 62, 151, 0.7));
    }
    .loader {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .sync {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.0), rgba(95, 62, 151, 0.7));
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
  private showControls = true;

  @state()
  private timer = 0;

  @state()
  private subtitles: {language: string, label: string, showing: boolean}[] = [];

  @state()
  private reactions: ReactionI[] = [];

  @state()
  user = '';

  @state ()
  private showUserModal = false;

  @state()
  private socket?: Socket;

  @state()
  private users: UserI[] = [];

  @state()
  private loading = true;

  // @state()
  // private checkInterval = 0;

  @state()
  private outOfSync?: UserI;

  @property()
  id = '';

  @property()
  connectionStatus: ConnectionStatus = 'disconnected';

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
          @playing="${this.handlePlaying}"
          @waiting="${this.handleWaiting}"
        >
          <source src="${`/media/${this.id}.mp4`}" type="video/mp4">
          <track kind="captions" src="${`/media/${this.id}.en.vtt`}" srclang="en" label="English" default>
          <track kind="captions" src="${`/media/${this.id}.es.vtt`}" srclang="es" label="Spanish">
        </video>
        ${this.loading ?
          html`
            <div class="loader">
              <pl-loader></pl-loader>
            </div>
          ` : html``
        }
        <div class="reactions">
          <pl-reactions
            .reactions=${this.reactions}
          ></pl-reactions>
        </div>
        <div class="users">
          <pl-users
            .users=${this.users}
          ></pl-users>
        </div>
        ${this.outOfSync ? html`
          <div class="sync">
            <pl-synchronize
              .username="${this.outOfSync.name}"
              @onsync="${this.handleSync}"
            ></pl-synchronize>
          </div>
        ` : html``
        }
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
              .connectionStatus=${this.connectionStatus}
              @onsubtitle="${this.handleSubtitles}"
              @onchange="${this.handleProgressChange}"
              @oninput="${this.handleProgressInput}"
              @onreaction="${this.handleReaction}"
              @onback="${this.handleBack}"
              @onforward="${this.handleForward}"
              @onconnect="${this.handleConnect}"
            ></pl-controls>
          </div>
        ` : html``}
        ${this.showUserModal ? html`
          <pl-modal>
            <pl-user
              .user="${this.user}"
              @onsetuser="${this.handleSetUser}"
            ></pl-user>
          </pl-modal>
        ` : html``}
      </div>
    `;
  };

  handlePlay() {
    if (this.video?.paused) {
      this.emit('play', {currentTime: this.currentTime});
      this.play();
      this.handleMouseMove();
    } else {
      this.emit('pause', {currentTime: this.currentTime});
      this.pause();
    }
  }
  
  play() {
    this.video.play();
    this.paused = false;
    this.showControls = false;
  }
  
  pause() {
    this.video.pause();
    this.paused = true;
    this.showControls = true;
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
    this.loading = false;
  }

  handleMouseMove() {
    this.showControls = true;
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      if (!this.video.paused) {
        this.showControls = false;
      }
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
    this.emit('change-time', {currentTime: e.detail.value});
    this.video.currentTime = e.detail.value;
  }

  handleProgressInput(e: CustomEvent) {
    // console.log('input', e.detail.value);
    this.emit('change-time', {currentTime: e.detail.value});
    this.video.currentTime = e.detail.value;
  }

  changeTime(currentTime: number) {
    this.video.currentTime = currentTime;
  }

  handleReaction(e: CustomEvent) {
    const reaction: ReactionI = generateReaction(e.detail.reaction, this.user);
    this.emit('reaction', {reaction});
    this.addReaction(reaction);
  }

  addReaction(reaction: ReactionI) {
    const newReactions = [...this.reactions.slice(-19).map(r => ({...r})), reaction];
    this.reactions = newReactions;
  }

  handleBack() {
    const currentTime = this.video.currentTime - 5;
    this.emit('change-time', {currentTime});
    this.video.currentTime = currentTime;
  }

  handleForward() {
    const currentTime = this.video.currentTime + 5;
    this.emit('change-time', {currentTime});
    this.video.currentTime = currentTime;
  }

  handlePlaying() {
    console.log('playing');
    this.loading = false;
  }

  handleWaiting() {
    console.log('waiting');
    this.loading = true;
  }

  handleConnect() {
    console.log('connect');
    const localUser = localStorage.getItem('user');
    if (localUser) {
      this.user = JSON.parse(localUser);
    }
    this.showUserModal = true;
  }

  handleSetUser(e: CustomEvent) {
    this.user = e.detail.user;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.showUserModal = false;
    this.connect();
  }
  private connect() {
    this.connectionStatus = 'connecting';
    this.socket = io(WS_HOST, {
      reconnectionAttempts: 10,
      timeout: 10000,
      path: WS_PATH,
    });

    // connected to server
    this.socket.on('connect', () => {
      console.log('connect');
      this.emit('join', {
        user: this.user,
        room: this.id,
        currentTime: this.currentTime,
      });
    });

    // connected to room
    this.socket.on('connected', (message) => {
      console.log('connected', message);
      this.connectionStatus = 'connected';
      // this.checkInterval = window.setInterval(() => {
      //   this.check();
      // }, 1000);
      this.users = message.users;
    });

    // connection error
    this.socket.on('connect_error', (error) => {
      console.log('Connect error', error);
    });

    // trying to reconnect
    this.socket.io.on('reconnect_attempt', (attempt) => {
      console.log('reconnect attempt', attempt);
      this.connectionStatus = 'reconnecting';
    });

    // reconnect failed
    this.socket.io.on('reconnect_failed', () => {
      console.log('Reconnect attempts failed');
      this.connectionStatus = 'disconnected';
    });

    // user connected to room
    this.socket.on('user-connected', (message) => {
      console.log('user-connected', message);
      this.users = message.users;
    });

    // user play video
    this.socket.on('play', (message) => {
      console.log('play', message);
      this.play();
    });

    // user pause video
    this.socket.on('pause', (message) => {
      console.log('pause', message);
      this.pause();
    });

    // user change time
    this.socket.on('change-time', (message) => {
      console.log('change-time', message);
      this.changeTime(message.currentTime);
    });

    // user reacts
    this.socket.on('reaction', (message) => {
      console.log('reaction', message);
      this.addReaction(message.reaction);
    });

    // user disconnected
    this.socket.on('user-disconnected', (message) => {
      console.log('user-disconnected', message);
      this.users = message.users;
    });

    // check users times
    this.socket.on('check', (message) => {
      console.log('check', message);
      this.users = message.users;
      this.checkTimes();
    });
  }

  emit(event: string, data?: any) {
    this.socket?.emit(event, data);
  }

  check() {
    this.emit('check', {currentTime: this.currentTime});
  }

  checkTimes() {
    this.outOfSync = this.users.find(user => user.currentTime < this.video.currentTime - 5);
  }

  handleSync() {
    const currentTime = this.outOfSync?.currentTime;
    if(currentTime) this.video.currentTime = currentTime;
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
