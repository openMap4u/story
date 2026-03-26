import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { customElement } from '../../../src/api/decorator/customElement.js';
import { style } from '../../../src/api/decorator/style.js';

describe('@style decorator', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should attach a <style> element to the shadow root on connectedCallback', () => {
    const tagName = 'styled-element-test';
    const css = ':host { color: red; }';

    @customElement(tagName)
    @style(css)
    class StyledElement extends HTMLElement {
      connectedCallback() {
        // Empty on purpose, or could log
      }
    }

    const el = document.createElement(tagName);
    container.appendChild(el);

    expect(el.shadowRoot).toBeDefined();
    expect(el.shadowRoot).not.toBeNull();

    const styleEl = el.shadowRoot?.querySelector('style');
    expect(styleEl).toBeDefined();
    expect(styleEl?.textContent).toBe(css);
  });

  it('should call the original connectedCallback', () => {
    const tagName = 'styled-element-test-callback';
    let called = false;

    @customElement(tagName)
    @style(':host {}')
    class StyledElementWithCallback extends HTMLElement {
      connectedCallback() {
        called = true;
      }
    }

    const el = document.createElement(tagName);
    container.appendChild(el);

    expect(called).toBe(true);
  });
});
