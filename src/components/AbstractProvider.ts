import { Signal } from '../api/signal.js';
import { Provider } from '../api/context.js';

export abstract class AbstractProviderComponent<T> extends HTMLElement {
  // A generic context name for this abstract component
  static readonly CONTEXT_KEY = Symbol('abstract-context');

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
