import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ReactionI } from '../../interfaces';
import './reaction';
import { repeat } from 'lit/directives/repeat.js';

@customElement('pl-reactions')
export class Reactions extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      user-select: none;
    }
    .reactions {
      display: flex;
      align-items: flex-end;
      height: 100%;
    }
  `;

  @property({type: Array})
  reactions: ReactionI[] = [];

  render () {
    return html`
      <div class="reactions">
        ${repeat(this.reactions, reaction => reaction.id, reaction => html`<pl-reaction .reaction=${reaction}></pl-reaction>`)}
      </div>
    `;
  }
}