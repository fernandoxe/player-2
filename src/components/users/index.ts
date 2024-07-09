import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { UserI } from '../../interfaces';
import '../../icons/person';

@customElement('pl-users')
export class Users extends LitElement {
  static styles = css`
    :host {
      font-size: 0.875rem;
      line-height: 1;
      user-select: none;
    }
    .list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
    }
    .user {
      display: flex;
      gap: 0.3rem;
      align-items: center;
    }
    .icon {
      width: 1rem;
      height: 1rem;
    }
  `;

  @property({ type: Array })
  users: UserI[] = [];

  render() {
    return html`
      <div class="list">
        ${repeat(this.users, user => user.id, user => html`
          <div class="user">
            <div class="icon">
              <pl-person-icon></pl-person-icon>
            </div>
            <div>
              ${user.name}
            </div>
          </div>
        `)}
      </div>
    `;
  }
}
