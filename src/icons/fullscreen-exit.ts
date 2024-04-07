import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Icon } from './icon';

@customElement('pl-fullscreen-exit-icon')
export class FullscreenExit extends Icon {
  render () {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 -960 960 960" width="100%" fill="currentColor">
        <path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/>
      </svg>
    `;
  }
}
