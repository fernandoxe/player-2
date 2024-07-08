import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UserI } from '../../interfaces';

@customElement('pl-users')
export class Users extends LitElement {
  static styles = css`
    :host {
      font-size: 0.75rem;
      line-height: 1;
      user-select: none;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    }
  `;

  @property({ type: Array })
  users: UserI[] = [];

  render() {
    return html`
      <div class="list">
        ${repeat(this.users, user => user.id, user => html`
          <div>${user.name}</div>
        `)}
      </div>
    `;
  }
}
