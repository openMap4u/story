export type Subscriber<T> = (value: T) => void;

export class Signal<T> {
  private _value: T;
  private _subscribers: Set<Subscriber<T>> = new Set();

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

  subscribe(subscriber: Subscriber<T>): () => void {
    this._subscribers.add(subscriber);
    subscriber(this._value); // Immediate call with current value
    return () => this._subscribers.delete(subscriber);
  }

  private notify(): void {
    for (const subscriber of this._subscribers) {
      subscriber(this._value);
    }
  }
}

export function createSignal<T>(initialValue: T): [() => T, (newValue: T) => void, (subscriber: Subscriber<T>) => () => void] {
    const signal = new Signal<T>(initialValue);
    return [
        () => signal.value,
        (newValue: T) => { signal.value = newValue; },
        (subscriber: Subscriber<T>) => signal.subscribe(subscriber)
    ];
}
