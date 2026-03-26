import { describe, it, expect } from 'vitest';
import { customElement } from '../../../src/api/decorator/customElement.js';

describe('@customElement decorator', () => {
  it('should register the class as a custom element', () => {
    const tagName = 'my-custom-element';

    @customElement(tagName)
    class MyElement extends HTMLElement {}

    const registeredClass = customElements.get(tagName);
    expect(registeredClass).toBeDefined();
    expect(registeredClass).toBe(MyElement);
  });
});
