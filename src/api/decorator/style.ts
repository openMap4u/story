/**
 * Decorator to attach styles to a Web Component's shadow root.
 *
 * It overrides the `connectedCallback` to append a `<style>` element
 * containing the provided CSS string to the `shadowRoot`.
 *
 * @example
 * ```typescript
 * import { style, customElement } from 'om4u';
 *
 * @customElement('styled-element')
 * @style(`
 *   :host { display: block; padding: 16px; }
 *   p { color: red; }
 * `)
 * class StyledElement extends HTMLElement {
 *   connectedCallback() {
 *     this.innerHTML = `<p>Red Text</p>`;
 *   }
 * }
 * ```
 *
 * @param cssString The CSS string to apply.
 */

// Global counter for unique style IDs to avoid collisions
let styleCounter = 0;

export function style(cssString: string) {
  // Generate a unique ID per decorator usage
  const styleId = `style-decorator-${++styleCounter}`;

  return function <T extends { new (...args: any[]): HTMLElement }>(target: T): T {
    return class extends target {
      connectedCallback() {
        // Call the original connectedCallback if it exists
        // @ts-ignore
        if (super.connectedCallback) {
          // @ts-ignore
          super.connectedCallback();
        }

        // Ensure shadowRoot exists, if not, create one
        let shadowRoot = this.shadowRoot;
        if (!shadowRoot) {
          shadowRoot = this.attachShadow({ mode: 'open' });
        }

        // Check if style is already attached to avoid duplicates on re-connect
        if (!shadowRoot.querySelector(`style#${styleId}`)) {
          const styleElement = document.createElement('style');
          styleElement.id = styleId;
          styleElement.textContent = cssString;
          shadowRoot.appendChild(styleElement);
        }
      }
    };
  };
}
