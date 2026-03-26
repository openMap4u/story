// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { setStyle } from './setStyle';
import { customElement } from './customElement';

describe('setStyle decorator', () => {
    it('should inject a style element into the shadow DOM', () => {
        const tagName = 'styled-element';
        const styles = `
            :host { display: block; }
            .content { color: red; }
        `;

        @customElement(tagName)
        @setStyle(styles)
        class StyledElement extends HTMLElement {
            connectedCallback() {
                // Ensure shadowRoot exists, might be created by decorator or manually here if needed
                if (this.shadowRoot) {
                    const div = document.createElement('div');
                    div.className = 'content';
                    div.textContent = 'Styled Content';
                    this.shadowRoot.appendChild(div);
                }
            }
        }

        const element = document.createElement(tagName) as StyledElement;
        document.body.appendChild(element); // Trigger connectedCallback

        expect(element.shadowRoot).not.toBeNull();

        const styleEl = element.shadowRoot!.querySelector('style');
        expect(styleEl).not.toBeNull();
        expect(styleEl!.textContent).toBe(styles);

        const contentDiv = element.shadowRoot!.querySelector('.content');
        expect(contentDiv).not.toBeNull();
    });

    it('should attach a shadow root if one does not exist', () => {
        const tagName = 'auto-shadow-element';
        const styles = ':host { background: blue; }';

        @customElement(tagName)
        @setStyle(styles)
        class AutoShadowElement extends HTMLElement {
            // No explicit attachShadow in constructor
        }

        const element = document.createElement(tagName);
        expect(element.shadowRoot).toBeDefined();
        expect(element.shadowRoot!.querySelector('style')!.textContent).toBe(styles);
    });
});
