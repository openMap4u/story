import { Signal } from '../state/signal.js';

// Symbol used to store the signal mapping on the DOM node directly
export const CONTEXT_SYMBOL = Symbol('__context_signals__');

// Ensure the Element has the context symbol map
export interface ContextElement extends HTMLElement {
  [CONTEXT_SYMBOL]?: Map<string | symbol, Signal<any>>;
}
