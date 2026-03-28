import { customElement } from '../api/decorator/customElement.js';
import { Consumer } from '../api/decorator/consumer.js';
import { AbstractConsumerComponent } from './AbstractConsumer.js';
import { Om4uStory, StoryContextState } from './om4ustory.js';

@customElement('om4u-page')
export class Om4uPage extends AbstractConsumerComponent<StoryContextState> {
  private _id: string;

  @Consumer(Om4uStory.CONTEXT_KEY)
  protected _signal?: import('../api/state/signal.js').Signal<StoryContextState>;

  constructor() {
    super();
    this._id = '';
    this.attachShadow({ mode: 'open' });
  }

  get id() {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  connectedCallback() {
    this._id = this.getAttribute('id') || crypto.randomUUID();
    super.connectedCallback();

    // Find provider up the tree
    const provider = this.closest('om4u-story') as Om4uStory;
    if (provider) {
       provider.registerPage(this._id);
    }
  }

  protected onSignalUpdate(value: StoryContextState): void {
    if (this.shadowRoot) {
      if (value.activePageId === this._id) {
        this.shadowRoot.innerHTML = `<slot></slot>`;
      } else {
        this.shadowRoot.innerHTML = ``;
      }
    }
  }
}
