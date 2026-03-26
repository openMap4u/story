// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { customElement } from './customElement';

describe('customElement decorator', () => {
    it('should register a class as a custom element', () => {
        const tagName = 'my-test-element';

        @customElement(tagName)
        class MyTestElement extends HTMLElement {
            connectedCallback() {
                this.innerHTML = 'Hello from MyTestElement';
            }
        }

        expect(customElements.get(tagName)).toBeDefined();
        expect(customElements.get(tagName)).toBe(MyTestElement);

        const element = document.createElement(tagName);
        document.body.appendChild(element); // Trigger connectedCallback

        expect(element).toBeInstanceOf(MyTestElement);
        expect(element.innerHTML).toBe('Hello from MyTestElement');

        document.body.removeChild(element);
    });

    it('should not register if already defined', () => {
        const tagName = 'already-defined-element';

        @customElement(tagName)
        class FirstElement extends HTMLElement {}

        @customElement(tagName)
        class SecondElement extends HTMLElement {}

        expect(customElements.get(tagName)).toBe(FirstElement);
        expect(customElements.get(tagName)).not.toBe(SecondElement);
    });
});
