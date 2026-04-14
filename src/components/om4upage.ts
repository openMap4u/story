import { customElement } from '../api/decorator/customElement.js';
import { Consumer } from '../api/decorator/consumer.js';
import { Attribute } from '../api/decorator/attribute.js';
import { AbstractConsumerComponent } from './AbstractConsumer.js';
import { Om4uStory, StoryContextState } from './om4ustory.js';

@customElement('om4u-page')
export class Om4uPage extends AbstractConsumerComponent<StoryContextState> {
  @Attribute('id')
  declare id: string;

  @Attribute('transition')
  declare transition: string;

  @Consumer(Om4uStory.CONTEXT_KEY)
  protected _signal?: import('../api/state/signal.js').Signal<StoryContextState>;

  private _isActive: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (!this.id) {
      this.id = crypto.randomUUID();
    }
    super.connectedCallback();

    if (this._signal) {
       this._signal.value.registerPage(this.id);
    }

    // Only apply the transition attribute if viewTransitionName isn't already set via style
    if (this.transition && !this.style.viewTransitionName) {
        this.style.viewTransitionName = this.transition;
    }
  }

  protected onSignalUpdate(value: StoryContextState): void {
    if (this.shadowRoot) {
      const isActive = value.activePageId === this.id;
      if (isActive !== this._isActive) {
        this._isActive = isActive;
        if (isActive) {
          this.shadowRoot.innerHTML = `<slot></slot>`;
        } else {
          this.shadowRoot.innerHTML = ``;
        }
      }
    }
  }
}
