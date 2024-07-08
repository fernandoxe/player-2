import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../icons/sync';

@customElement('pl-synchronize')
export class Synchronize extends LitElement {
  static styles = css`
    :host {
      color: red;
      box-sizing: border-box;
      user-select: none;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: white;
    }
    .description {
      font-size: 0.875rem;
      white-space: nowrap;
    }
    .username {
      font-weight: bold;
    }
    .button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      cursor: pointer;
    }
    .icon {
      width: 2rem;
      height: 2rem;
      padding: 0;
    }
  `;

  @property({ type: String })
  username = '';

  render() {
    return html`
      <div class="container">
        <div class="description">
          <span class="username">${this.username}</span> is out of sync -5s
        </div>
        <div
          class="button"
          @click="${this.handleSync}"
        >
          <div class="icon">
            <pl-sync-icon></pl-sync-icon>
          </div>
          <div class="sync">
            Synchronize
          </div>
        </div>
      </div>
    `;
  }

  handleSync() {
    this.dispatchEvent(new CustomEvent('onsync'));
  }
};
