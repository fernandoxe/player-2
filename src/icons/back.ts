import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Icon } from './icon';

@customElement('pl-back-icon')
export class Back extends Icon {
  render () {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="-200 -960 960 960" width="100%" fill="currentColor">
        <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
      </svg>
    `;
  }
}
