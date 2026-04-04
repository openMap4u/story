import { customElement } from '../api/decorator/customElement.js';
import { AbstractProviderComponent } from './AbstractProvider.js';

export interface StoryContextState {
  activePageId: string | null;
  registerPage: (id: string) => void;
  transitions: Record<string, string>;
  registerTransition: (id: string, transition: string) => void;
}

import { Provider } from '../api/decorator/provider.js';

@customElement('om4u-story')
export class Om4uStory extends AbstractProviderComponent<StoryContextState> {
  static readonly CONTEXT_KEY: symbol = Symbol('om4ustory-context');

  @Provider(Om4uStory.CONTEXT_KEY)
  declare protected _signal: import('../api/state/signal.js').Signal<StoryContextState>;

  constructor() {
    super({
      activePageId: null,
      registerPage: (id: string) => this.registerPage(id),
      transitions: { forward: 'slide-left', back: 'slide-right' },
      registerTransition: (id: string, transition: string) => this.registerTransition(id, transition)
    });
  }

  // Allow consumer to register and potentially set initial active page
  registerPage(id: string) {
    if (this._signal && this._signal.value.activePageId === null) {
      this.updateSignal({ ...this._signal.value, activePageId: id });
    }
  }

  registerTransition(id: string, transition: string) {
    if (this._signal) {
      this.updateSignal({
        ...this._signal.value,
        transitions: {
          ...this._signal.value.transitions,
          [id]: transition
        }
      });
    }
  }

  setActivePage(id: string, action?: string) {
    if (this._signal) {
      if ('startViewTransition' in document) {
        let transitionName: string | undefined;

        if (action) {
          transitionName = this._signal.value.transitions[action];
        }

        if (transitionName) {
            document.documentElement.setAttribute('data-transition', transitionName);
        }

        const transition = (document as any).startViewTransition(() => {
          this.updateSignal({ ...this._signal!.value, activePageId: id });
        });

        transition.finished.finally(() => {
            if (transitionName) {
                document.documentElement.removeAttribute('data-transition');
            }
        });
      } else {
        this.updateSignal({ ...this._signal.value, activePageId: id });
      }
    }
  }

  connectedCallback() {
    // @ts-ignore
    if (super.connectedCallback) {
      // @ts-ignore
      super.connectedCallback();
    }
    // Basic rendering of slot
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot!.innerHTML = `<slot></slot>`;
    }
  }
}
