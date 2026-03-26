/**
 * Decorator to attach styles to a Web Component's shadow root.
 *
 * It overrides the `connectedCallback` to append a `<style>` element
 * containing the provided CSS string to the `shadowRoot`.
 *
 * @param cssString The CSS string to apply.
 */

// Global counter for unique style IDs to avoid collisions
let styleCounter = 0;

export function style(cssString: string) {
  // Generate a unique ID per decorator usage
  const styleId = `style-decorator-${++styleCounter}`;

  return function <T extends { new (...args: any[]): HTMLElement }>(target: T) {
    return class extends target {
      connectedCallback() {
        // Call the original connectedCallback if it exists
        if (super.connectedCallback) {
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
