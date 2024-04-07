import { LitElement, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('pl-icon')
export abstract class Icon extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  `;
}
