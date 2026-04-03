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

    if (this.transition) {
        this.style.viewTransitionName = this.transition;
    }
  }

  protected onSignalUpdate(value: StoryContextState): void {
    if (this.shadowRoot) {
      if (value.activePageId === this.id) {
        this.shadowRoot.innerHTML = `<slot></slot>`;
      } else {
        this.shadowRoot.innerHTML = ``;
      }
    }
  }
}
