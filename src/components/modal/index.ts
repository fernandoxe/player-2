import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pl-modal')
export class Modal extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1;
    }
    .container {
      width: 100%;
      height: 100%;
    }
    .modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #444;
      padding: 1rem;
      border-radius: 5px;
    }
  `;

  render () {
    return html`
      <div
        class="container"
        @click=${this.handleClose}
      >
        <div
          class="modal"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

  handleClose () {
    this.dispatchEvent(new CustomEvent('onclose'));
  }
    
}