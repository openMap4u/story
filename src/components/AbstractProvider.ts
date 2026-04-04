import { Signal } from '../api/state/signal.js';
import { Provider } from '../api/decorator/provider.js';
import { Attribute } from '../api/decorator/attribute.js';

export abstract class AbstractProviderComponent<T> extends HTMLElement {
  @Attribute('style')
  declare customStyle: string;

  // A generic context name for this abstract component
  static readonly CONTEXT_KEY: symbol = Symbol('abstract-context');

  @Provider(AbstractProviderComponent.CONTEXT_KEY)
  protected _signal!: Signal<T>;

  constructor(initialValue: T) {
    super();
    this._signal = new Signal(initialValue);
  }

  // Allow subclasses to update the provided value
  protected updateSignal(newValue: T) {
    if (this._signal) {
      this._signal.value = newValue;
    }
  }
}
