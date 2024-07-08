import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Router } from '@lit-labs/router';
// @ts-ignore
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
  console.log('URLPattern polyfill loaded');
}
import './components/video';

import * as Sentry from '@sentry/browser';
import { SENTRY_DSN } from './components/constants';

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  // tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

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
