import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { REACTION_TYPE, ReactionI } from '../../../interfaces';

@customElement('pl-reaction')
export class Reaction extends LitElement {
  static styles = css`
    :host {
      height: 100%;
    }
    .container {
      height: 100%;
      position: absolute;
      top: 0;
      display: flex;
      align-items: flex-end;
      animation: bubble 2.8s linear forwards;
      /* will-change: transform, opacity; */
      padding: 0.125rem 0;
      box-sizing: border-box;
    }
    .reaction {
      display: flex;
      align-items: center;
      line-height: 1;
      gap: 0.125rem;
    }
    .name {
      font-size: 1.5vw;
      background-color: rgba(95, 62, 151, 0.4);
      color: white;
      border-radius: 0.25rem;
      padding: 0.125rem 0.25rem;
    }
    @keyframes bubble {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      30% {
        opacity: 0.8;
      }
      100% {
        transform: translateY(-100%);
      }
    }
  `;

  @property({type: Object})
  reaction!: ReactionI;

  render () {
    return html`
      <div
        class="container"
        style="${styleMap({left: `${0.5 + this.reaction.position}vw`})}"
      >
        <div class="reaction">
          <div
            class="emoji"
            style="${styleMap({'font-size': `${3.7 + this.reaction.size * 0.3}vw`})}"
          >
            ${REACTION_TYPE[this.reaction.code]}
          </div>
          <div class="name">
            ${this.reaction.user}
          </div>
        </div>
      </div>
    `;
  }
}