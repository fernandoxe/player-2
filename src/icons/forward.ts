import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Icon } from './icon';

@customElement('pl-forward-icon')
export class Forward extends Icon {
  render () {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="currentColor">
        <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
      </svg>
    `;
  }
}
