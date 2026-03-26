import { Signal } from './signal.js';

// Symbol used to store the signal mapping on the DOM node directly
const CONTEXT_SYMBOL = Symbol('__context_signals__');

// Ensure the Element has the context symbol map
interface ContextElement extends HTMLElement {
  [CONTEXT_SYMBOL]?: Map<string | symbol, Signal<any>>;
}

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

/**
 * Decorator for Web Components to consume a signal context.
 *
 * It looks up the DOM tree from the current element to find an ancestor
 * that provides the signal for the given contextName.
 */
export function Consumer(contextName: string | symbol) {
  return function (target: any, propertyKey: string | symbol) {
    const privateKey = Symbol(`__consumed_${String(propertyKey)}`);

    Object.defineProperty(target, propertyKey, {
      get(this: ContextElement) {
        // If we already cached it, return it
        if ((this as any)[privateKey]) {
          return (this as any)[privateKey];
        }

        // Search up the DOM tree for a provider
        let current: HTMLElement | null = this;
        while (current) {
          const contextMap = (current as ContextElement)[CONTEXT_SYMBOL];
          if (contextMap && contextMap.has(contextName)) {
            const signal = contextMap.get(contextName)!;
            // Cache it for next time
            (this as any)[privateKey] = signal;
            return signal;
          }
          current = current.parentElement || (current.getRootNode() as ShadowRoot)?.host as HTMLElement | null;
        }

        return undefined; // Not found
      },
      set(this: ContextElement, newVal: any) {
         // Optionally allow tests to inject directly
         (this as any)[privateKey] = newVal;
      },
      enumerable: true,
      configurable: true
    });
  };
}
