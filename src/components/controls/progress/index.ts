import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('pl-progress')
export class Progress extends LitElement {
  static styles = css`
    .progress {
      display: flex;
      width: 100%;
      height: 0.5rem;
      background-color: rgba(0, 0, 0, 0.1);
      position: relative;
    }
    .progress-bar {
      height: 100%;
      background-color: rgba(95, 62, 151, 0.9);
      position: absolute;
      top: 0;
      left: 0;
    }
    .range {
      appearance: none;
      width: 100%;
      height: 100%;
      background-color: transparent;
      outline: none;
      margin: 0;
      z-index: 1;
      &::-webkit-slider-thumb {
        appearance: none;
        width: 0.25rem;
        height: 0.25rem;
        transform: scale(3);
        background-color: #fff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  `;

  @query('.range')
  range!: HTMLInputElement;

  @property({type: Number})
  currentTime = 0;

  @property({type: Number})
  duration = 0;

  render() {
    return html`
      <div class="progress">
        <div
          class="progress-bar"
          style="${styleMap({width: `${this.currentTime * 100 / this.duration}%`})}"
        ></div>
        <input
          class="range"
          type="range"
          min="0"
          max="${this.duration}"
          .value=${String(this.currentTime)}
          @input="${this.handleInput}"
        />
      </div>
    `;
  }

  handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    this.dispatchEvent(new CustomEvent('onchange', {
      detail: {
        value,
      },
      composed: true,
    }));
    console.log('change', value);
  }

  handleInput(e: Event) {
    // console.log('handleInput', e.target);
    const value = this.range.value;
    this.dispatchEvent(new CustomEvent('oninput', {
      detail: {
        value,
      },
      composed: true,
    }));
    console.log('input', value);
  }
}
