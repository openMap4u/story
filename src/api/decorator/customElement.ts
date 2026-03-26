/**
 * A class decorator that registers a custom element with the given tag name.
 *
 * @param tagName The tag name for the custom element
 */
export function customElement(tagName: string) {
    return function (target: CustomElementConstructor) {
        if (!customElements.get(tagName)) {
            customElements.define(tagName, target);
        }
    };
}
