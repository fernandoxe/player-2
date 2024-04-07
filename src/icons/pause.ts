import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Icon } from './icon';

@customElement('pl-pause-icon')
export class Pause extends Icon {
  render () {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="currentColor">
        <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/>
      </svg>
    `;
  }
}
