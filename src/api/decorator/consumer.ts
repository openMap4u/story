import { Signal } from '../state/signal.js';
import { CONTEXT_SYMBOL, ContextElement } from './core.js';

/**
 * Decorator for Web Components to consume a signal context.
 *
 * It looks up the DOM tree from the current element to find an ancestor
 * that provides the signal for the given contextName.
 */
export function Consumer<T = any>(contextName: string | symbol) {
  return function (target: any, propertyKey: string | symbol) {
    const privateKey = Symbol(`__consumed_${String(propertyKey)}`);

    Object.defineProperty(target, propertyKey, {
      get(this: ContextElement): Signal<T> | undefined {
        // If we already cached it, return it
        if ((this as any)[privateKey]) {
          return (this as any)[privateKey];
        }

        // Search up the DOM tree for a provider
        let current: HTMLElement | null = this;
        while (current) {
          const contextMap = (current as ContextElement)[CONTEXT_SYMBOL];
          if (contextMap && contextMap.has(contextName)) {
            const signal = contextMap.get(contextName)! as Signal<T>;
            // Cache it for next time
            (this as any)[privateKey] = signal;
            return signal;
          }
          current = current.parentElement || (current.getRootNode() as ShadowRoot)?.host as HTMLElement | null;
        }

        return undefined; // Not found
      },
      set(this: ContextElement, newVal: Signal<T> | undefined) {
         // Optionally allow tests to inject directly
         (this as any)[privateKey] = newVal;
      },
      enumerable: true,
      configurable: true
    });
  };
}
