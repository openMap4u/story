import { Signal } from '../api/state/signal.js';
import { Consumer } from '../api/decorator/consumer.js';
import { Attribute } from '../api/decorator/attribute.js';
import { AbstractProviderComponent } from './AbstractProvider.js';

export abstract class AbstractConsumerComponent<T> extends HTMLElement {
  @Attribute('style')
  declare customStyle: string;
  // Try to consume the context key defined in the provider
  @Consumer(AbstractProviderComponent.CONTEXT_KEY)
  protected _signal?: Signal<T>;

  private _unsubscribe?: () => void;

  connectedCallback() {
    if (this._signal) {
      this._unsubscribe = this._signal.subscribe((value) => {
        this.onSignalUpdate(value);
      });
    }
  }

  disconnectedCallback() {
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = undefined;
    }
  }

  // Hook for subclasses to handle signal updates
  protected abstract onSignalUpdate(value: T): void;
}
