import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { REACTION_TYPE } from '../../../interfaces';

@customElement('pl-reaction-buttons')
export class ReactionButtons extends LitElement {
  static styles = css`
    .reactions {
      display: flex;
      gap: 1rem;
    }
    .reaction {
      font-size: 1.25rem;
      cursor: pointer;
    }
  `;

  render() {
    return html`
      <div class="reactions">
        ${Object.keys(REACTION_TYPE).map(reaction =>
          html`
            <div
              class="reaction"
              @click=${() => this.handleReaction(reaction)}
            >
              ${REACTION_TYPE[reaction]}
            </div>
          `
        )}
      </div>
    `;
  }

  handleReaction(reaction: string) {
    this.dispatchEvent(new CustomEvent('onreaction', {
      detail: {reaction},
      composed: true
    }));
  }
}
