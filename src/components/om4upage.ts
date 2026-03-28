import { customElement } from '../api/decorator/customElement.js';
import { Consumer } from '../api/decorator/consumer.js';
import { Attribute } from '../api/decorator/attribute.js';
import { AbstractConsumerComponent } from './AbstractConsumer.js';
import { Om4uStory, StoryContextState } from './om4ustory.js';

@customElement('om4u-page')
export class Om4uPage extends AbstractConsumerComponent<StoryContextState> {
  @Attribute('id')
  declare id: string;

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

    // Find provider up the tree
    const provider = this.closest('om4u-story') as Om4uStory;
    if (provider) {
       provider.registerPage(this.id);
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
