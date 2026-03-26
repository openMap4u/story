/**
 * A class decorator that applies styling to a custom element.
 *
 * @param styleString A string containing the CSS rules
 */
export function setStyle(styleString: string) {
    return function <T extends { new(...args: any[]): HTMLElement }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);

                // Ensure shadow DOM exists before appending style
                const shadow = this.shadowRoot || this.attachShadow({ mode: 'open' });

                // Append the style element
                const styleSheet = document.createElement('style');
                styleSheet.textContent = styleString;
                shadow.appendChild(styleSheet);
            }
        };
    };
}
