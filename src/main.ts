import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
// @ts-ignore
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
  console.log('URLPattern polyfill loaded');
}
import './components/video';

@customElement('pl-home')
export class Home extends LitElement {
  private routes = new Router(this, [
    {
      path: '/:id',
      render: ({id = ''}) => html`<pl-video id="${id}"></pl-video>`,
    },
    {
      path: '/',
      render: () => html`Not found`,
    }
  ]);

  render() {
    return html`
      <main>${this.routes.outlet()}</main>
    `;
  };
}
