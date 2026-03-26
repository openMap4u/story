import { Signal } from '../state/signal.js';
import { CONTEXT_SYMBOL, ContextElement } from './core.js';

/**
 * Decorator to consume a specific property from a signal context.
 *
 * It looks up the DOM tree from the current element to find an ancestor
 * that provides the signal for the given `contextName`, then returns
 * a derived signal that only updates when the specific `propertyKey` changes.
 *
 * @param contextName The key of the context provided by a parent.
 * @param selectorKey The specific key on the signal's value to select.
 */
export function Select<T extends Record<string, any>, K extends keyof T>(
  contextName: string | symbol,
  selectorKey: K
) {
  return function (target: any, propertyKey: string | symbol) {
    const privateKey = Symbol(`__selected_${String(propertyKey)}`);
    const unsubKey = Symbol(`__unsub_${String(propertyKey)}`);

    // Patch prototype disconnectedCallback once at evaluation time.
    // This runs BEFORE customElements.define, meaning JSDOM captures it correctly.
    if (!target.__select_patched) {
      target.__select_patched = true;
      const originalDisconnect = target.disconnectedCallback;
      target.disconnectedCallback = function() {
        if (this.__select_cleanups) {
          for (const cleanup of this.__select_cleanups) {
            cleanup.call(this);
          }
          // Do NOT clear the array here, just let the cleanups run.
          // Or if we clear it, we must ensure re-connecting pushes them back.
          // But re-connecting reads the property and pushes again, so clearing is correct.
          this.__select_cleanups = [];
        }
        if (originalDisconnect) {
          originalDisconnect.call(this);
        }
      };
    }

    Object.defineProperty(target, propertyKey, {
      get(this: ContextElement) {
        // If we already cached the derived signal, return it
        if ((this as any)[privateKey]) {
          return (this as any)[privateKey];
        }

        // Search up the DOM tree for a provider
        let current: HTMLElement | null = this;
        let parentSignal: Signal<T> | undefined;

        while (current) {
          const contextMap = (current as ContextElement)[CONTEXT_SYMBOL];
          if (contextMap && contextMap.has(contextName)) {
            parentSignal = contextMap.get(contextName)!;
            break;
          }
          current = current.parentElement || (current.getRootNode() as ShadowRoot)?.host as HTMLElement | null;
        }

        if (parentSignal) {
          // Create a derived signal for the specific property
          const initialValue = parentSignal.value[selectorKey];
          const derivedSignal = new Signal(initialValue);

          // Subscribe to the parent signal to update the derived signal
          const unsubscribe = parentSignal.subscribe((newObj) => {
            derivedSignal.value = newObj[selectorKey];
          });

          // Store cleanup function
          (this as any)[unsubKey] = unsubscribe;

          // Cache it
          (this as any)[privateKey] = derivedSignal;

          // Store cleanup function in instance so our patched disconnectedCallback can call it.
          if (!(this as any).__select_cleanups) {
            (this as any).__select_cleanups = [];
          }

          (this as any).__select_cleanups.push(function(this: any) {
            if (this[unsubKey]) {
              this[unsubKey]();
              this[unsubKey] = undefined;
            }
            this[privateKey] = undefined; // clear cache for reparenting
          });

          return derivedSignal;
        }

        return undefined; // Provider not found
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
