import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../index.css';
import '../../icons/play';
import '../../icons/pause';
import '../../icons/group';
import '../../icons/subtitles';
import '../../icons/fullscreen';
import '../../icons/fullscreen-exit';
import './subtitles';
import './progress';
import './reaction-buttons';
import '../../icons/back';
import '../../icons/forward';

@customElement('pl-controls')
export class Controls extends LitElement {
  static styles = css`
    .container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem;
      box-sizing: border-box;
      background: rgba(95, 62, 151, 0.7);
      background: linear-gradient(0deg, rgba(95, 62, 151, 0.7), rgba(0, 0, 0, 0.0));
      user-select: none;
    }
    .controls {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon {
      width: 2rem;
      height: 2rem;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    /* .time {
      
    } */
    .backforward {
      display: flex;
      gap: 1rem;
      flex-grow: 1;
    }
    .back, .forward {
      width: 1.6rem;
      height: 1.6rem;
    }
    .subtitles {
      position: absolute;
      bottom: 3rem;
      right: 0;
    }
    .reactions {
      display: flex;
      justify-content: center;
    }
    .connecting {
      animation: ping 1s infinite;
    }
    .reconnecting {
      color: #f1c40f;
      animation: ping 1s infinite;
    }
    .connected {
      color: #2ecc71;
    }
    @keyframes ping {
      0% {
        opacity: 0.5;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.5;
      }
    }
  `;

  @property({type: Number})
  currentTime = 0;

  @property({type: Number})
  duration = 0;

  @property({type: Boolean})
  paused?: boolean;

  @property({type: Boolean})
  fullscreen?: boolean;

  @property({ type: Array})
  subtitles!: {language: string, label: string, showing: boolean}[];
  
  @property({type: String})
  private connectionStatus = '';

  @state()
  private showSubtitles = false;

  render() {
    return html`
      <div class="container">
        ${this.connectionStatus === 'connected' ? html`
          <div class="reactions">
            <pl-reaction-buttons></pl-reaction-buttons>
          </div>
        ` : html``}
        <div class="controls">
          <div
            class="icon"
            @click="${this.handlePlay}"
          >
            ${this.paused ?
              html`<pl-play-icon></pl-play-icon>`
              :
              html`<pl-pause-icon></pl-pause-icon>`
            }
          </div>
          <div class="time">
            <span>${this.formatTime(this.currentTime)}</span> / <span>${this.formatTime(this.duration)}</span>
          </div>
          <div class="backforward">
            <div
              class="icon back"
              @click="${this.handleBack}"
            >
              <pl-back-icon></pl-back-icon>
            </div>
            <div
              class="icon forward"
              @click="${this.handleForward}"
            >
              <pl-forward-icon></pl-forward-icon>
            </div>
          </div>
          <div
            class="icon ${this.connectionStatus}"
            @click="${this.handleConnect}"
          >
            <pl-group-icon></pl-group-icon>
          </div>
          <div
            class="icon"
            @click="${this.handleSubtitles}"
          >
            <pl-subtitles-icon></pl-subtitles-icon>
          </div>
            ${this.showSubtitles ?
              html`
                <div class="subtitles">
                  <pl-subtitles
                    .subtitles="${this.subtitles}"
                    @onsubtitle="${this.handleSubtitles}"
                  ></pl-subtitles>
                </div>
              `
              : ''}
          <div
            class="icon"
            @click="${this.handleFullscreen}"
          >
            ${this.fullscreen ?
              html`<pl-fullscreen-exit-icon></pl-fullscreen-exit-icon>`
              :
              html`<pl-fullscreen-icon></pl-fullscreen-icon>`
            }
          </div>
        </div>
        <div>
          <pl-progress
            .currentTime="${this.currentTime}"
            .duration="${this.duration}"
          ></pl-progress>
        </div>
      </div>
    `;
  }

  handlePlay() {
    this.dispatchEvent(new CustomEvent('onplay', {
      composed: true,
    }));
  }

  handleFullscreen() {
    this.dispatchEvent(new CustomEvent('onfullscreen'));
  }

  handleSubtitles() {
    this.showSubtitles = !this.showSubtitles;
  }

  handleBack() {
    this.dispatchEvent(new CustomEvent('onback'));
  }

  handleForward() {
    this.dispatchEvent(new CustomEvent('onforward'));
  }

  handleConnect() {
    if(this.connectionStatus === 'disconnected') {
      this.dispatchEvent(new CustomEvent('onconnect'));
    }
  }

  formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) % 60;
    const seconds = Math.floor(time % 60);
    return `${hours ? hours + ':' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}