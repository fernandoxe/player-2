import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '../../icons/send';

@customElement('pl-user')
export class User extends LitElement {
  static styles = css`
    .icon {
      width: 2rem;
      height: 2rem;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      outline: none;
    }
    .form {
      display: flex;
      gap: 0.5rem;
    }
  `;

  @property()
  user = '';

  @query('input')
  input!: HTMLInputElement;

  render () {
    return html`
      <form
        class="form"
        @submit=${this.handleSubmit}
      >
        <input
          type="text"
          value="${this.user}"
          placeholder="Your name"
          maxlength="30"
        />
        <button
          class="icon"
        >
          <pl-send-icon></pl-send-icon>
        </button>
      </form>
    `;
  }

  firstUpdated () {
    this.input.select();
  }

  handleSubmit (e: Event) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const input = target.querySelector('input') as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('onsetuser', {
      detail: {
        user: input.value
      }
    }));
  }
}
