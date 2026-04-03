import { customElement } from '../api/decorator/customElement.js';
import { Attribute } from '../api/decorator/attribute.js';
import { Consumer } from '../api/decorator/consumer.js';
import { AbstractConsumerComponent } from './AbstractConsumer.js';
import { Om4uStory, StoryContextState } from './om4ustory.js';

@customElement('om4u-transition')
export class Om4uTransition extends AbstractConsumerComponent<StoryContextState> {
  @Attribute('id')
  declare id: string;

  @Attribute('transition')
  declare transition: string;

  @Consumer(Om4uStory.CONTEXT_KEY)
  protected declare _signal?: import('../api/state/signal.js').Signal<StoryContextState>;

  connectedCallback() {
    super.connectedCallback();
    if (this._signal && this.id && this.transition) {
      this._signal.value.registerTransition(this.id, this.transition);
    }
  }

  protected onSignalUpdate(value: StoryContextState): void {
    // No-op
  }
}
