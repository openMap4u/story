import { Signal } from '../state/signal.js';
import { CONTEXT_SYMBOL, ContextElement } from './core.js';

/**
 * Decorator for Web Components to provide a signal context.
 *
 * It intercepts the property declaration on the prototype and handles
 * initializing the provider on the actual element instance so descendants can find it.
 */
export function Provider(contextName: string | symbol) {
  return function (target: any, propertyKey: string | symbol) {
    const privateKey = Symbol(`__provided_${String(propertyKey)}`);

    Object.defineProperty(target, propertyKey, {
      get(this: ContextElement) {
        return (this as any)[privateKey];
      },
      set(this: ContextElement, newVal: Signal<any>) {
        (this as any)[privateKey] = newVal;

        // Initialize the context map if it doesn't exist
        if (!this[CONTEXT_SYMBOL]) {
          this[CONTEXT_SYMBOL] = new Map();
        }

        // Register this signal under the context name
        this[CONTEXT_SYMBOL]!.set(contextName, newVal);
      },
      enumerable: true,
      configurable: true
    });
  };
}
