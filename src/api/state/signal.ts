export type Listener<T> = (value: T) => void;

export class Signal<T> {
  private _value: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = newValue;
      this.notify();
    }
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    // Immediately call with current value
    listener(this._value);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this._value));
  }
}

export function createSignal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}
