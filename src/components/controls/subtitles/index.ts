import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pl-subtitles')
export class Subtitles extends LitElement {
  static styles = css`
    .subtitles {
      list-style: none;
      background-color: rgba(95, 62, 151, 0.7);
      padding: 0.5rem;
      /* width: 100%;
      height: 100%; */
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      li {
        padding: 0.5rem 0.75rem;
        &:hover {
          cursor: pointer;
          background-color: rgba(95, 62, 151, 0.5); 
        }
      }
    }
    .showing {
      background-color: rgba(95, 62, 151, 9);
      font-weight: bold;
    }
  `;

  @property({ type: Array})
  subtitles: {language: string, label: string, showing: boolean}[] = [];
  
  render () {
    return html`
      <ul class="subtitles">
        ${this.subtitles.map((subtitle, i) =>
          html`
            <li
              @click=${() => this.handleSubtitleClick(i)}
              class=${subtitle.showing ? 'showing' : ''}
            >
              ${subtitle.label}
            </li>
          `
        )}
      </ul>
    `;
  }

  handleSubtitleClick (index: number) {
    this.dispatchEvent(new CustomEvent('onsubtitle', {
      detail: {
        index,
      },
      composed: true,
    }));
  }
}
