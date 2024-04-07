import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Icon } from './icon';

@customElement('pl-subtitles-icon')
export class Subtitles extends Icon {
  render () {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="currentColor">
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm80-160h320v-80H240v80Zm400 0h80v-80h-80v80ZM240-480h80v-80h-80v80Zm160 0h320v-80H400v80Z"/>
      </svg>
    `;
  }
}
