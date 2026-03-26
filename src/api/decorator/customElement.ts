/**
 * Decorator to register a Web Component.
 *
 * @param tagName The tag name of the custom element.
 */
export function customElement(tagName: string) {
  return function (target: CustomElementConstructor) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, target);
    }
  };
}
