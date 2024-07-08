import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('pl-loader')
export class Loader extends LitElement {
  static styles = css`
    .loader {
      border: 6px solid rgba(80, 50, 180);
      border-top-color: transparent;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `;

  render() {
    return html`
      <div class="loader"></div>
    `;
  }
};
