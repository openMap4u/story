export type Listener<T> = (value: T) => void;

function createReactiveProxy<T>(
  target: T,
  notify: () => void,
  proxyCache: WeakMap<object, any> = new WeakMap()
): T {
  if (target === null || typeof target !== 'object') {
    return target;
  }
  if (target instanceof Date || target instanceof RegExp) {
    return target;
  }
  if ((target as any)['__isProxy']) {
    return target;
  }
  if (proxyCache.has(target as object)) {
    return proxyCache.get(target as object);
  }

  const handler: ProxyHandler<any> = {
    get(obj, prop, receiver) {
      if (prop === '__isProxy') return true;
      const value = Reflect.get(obj, prop, receiver);
      return createReactiveProxy(value, notify, proxyCache);
    },
    set(obj, prop, value, receiver) {
      const oldValue = Reflect.get(obj, prop, receiver);
      if (oldValue !== value) {
        const result = Reflect.set(obj, prop, value, receiver);
        notify();
        return result;
      }
      return true;
    },
    deleteProperty(obj, prop) {
      const result = Reflect.deleteProperty(obj, prop);
      notify();
      return result;
    }
  };

  const proxy = new Proxy(target as object, handler) as T;
  proxyCache.set(target as object, proxy);
  return proxy;
}

export class Signal<T> {
  private _value: T;
  private listeners: Set<Listener<T>> = new Set();
  private proxyCache = new WeakMap<object, any>();

  constructor(initialValue: T) {
    this._value = this.createProxy(initialValue);
  }

  private createProxy(value: T): T {
    return createReactiveProxy(value, () => this.notify(), this.proxyCache);
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value !== newValue) {
      this._value = this.createProxy(newValue);
      this.notify();
    }
  }

  update(updater: (value: T) => T | void): void {
    const newValue = updater(this._value);
    if (newValue !== undefined && newValue !== this._value) {
      this.value = newValue as T;
    }
  }

  map<U>(mapper: (value: T) => U): Signal<U> {
    const derived = new Signal<U>(mapper(this._value));
    this.subscribe((newValue) => {
      derived.value = mapper(newValue);
    });
    return derived;
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
