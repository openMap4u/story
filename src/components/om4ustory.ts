import { customElement } from '../api/decorator/customElement.js';
import { AbstractProviderComponent } from './AbstractProvider.js';

export interface StoryContextState {
  activePageId: string | null;
  registerPage: (id: string) => void;
}

import { Provider } from '../api/decorator/provider.js';

@customElement('om4u-story')
export class Om4uStory extends AbstractProviderComponent<StoryContextState> {
  static readonly CONTEXT_KEY = Symbol('om4ustory-context');

  @Provider(Om4uStory.CONTEXT_KEY)
  declare protected _signal: import('../api/state/signal.js').Signal<StoryContextState>;

  constructor() {
    super({ activePageId: null, registerPage: (id: string) => this.registerPage(id) });
  }

  // Allow consumer to register and potentially set initial active page
  registerPage(id: string) {
    if (this._signal && this._signal.value.activePageId === null) {
      this.updateSignal({ ...this._signal.value, activePageId: id });
    }
  }

  setActivePage(id: string) {
    if (this._signal) {
      this.updateSignal({ ...this._signal.value, activePageId: id });
    }
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    // Basic rendering of slot
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = `<slot></slot>`;
    }
  }
}
