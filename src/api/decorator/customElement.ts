/**
 * Decorator to register a Web Component.
 *
 * @example
 * ```typescript
 * import { customElement } from 'om4u';
 *
 * @customElement('my-element')
 * class MyElement extends HTMLElement {
 *   connectedCallback() {
 *     this.innerHTML = `<p>Hello World!</p>`;
 *   }
 * }
 * ```
 *
 * @param tagName The tag name of the custom element (e.g., 'my-element'). Must contain a hyphen.
 */
export function customElement(tagName: string) {
  return function (target: CustomElementConstructor) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, target);
    }
  };
}
