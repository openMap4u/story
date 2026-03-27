import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Attribute } from '../../../src/api/decorator/attribute.js';
import { customElement } from '../../../src/api/decorator/customElement.js';

@customElement('test-attribute')
class TestAttributeElement extends HTMLElement {
  @Attribute()
  public stringVal!: string | null;

  @Attribute({ type: Number })
  public numberVal!: number | null;

  @Attribute({ type: Boolean })
  public booleanVal!: boolean;

  @Attribute('custom-name')
  public customNameVal!: string | null;

  @Attribute({ name: 'custom-number', type: Number })
  public customNumberVal!: number | null;
}

describe('@Attribute decorator', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should reflect string property to attribute', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.stringVal = 'test-string';
    expect(el.getAttribute('stringVal')).toBe('test-string');

    el.stringVal = null;
    expect(el.hasAttribute('stringVal')).toBe(false);
  });

  it('should reflect attribute to string property', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.setAttribute('stringVal', 'attr-value');
    expect(el.stringVal).toBe('attr-value');

    el.removeAttribute('stringVal');
    expect(el.stringVal).toBeNull();
  });

  it('should reflect number property to attribute', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.numberVal = 42;
    expect(el.getAttribute('numberVal')).toBe('42');

    el.numberVal = 0;
    expect(el.getAttribute('numberVal')).toBe('0');

    el.numberVal = null;
    expect(el.hasAttribute('numberVal')).toBe(false);
  });

  it('should reflect attribute to number property', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.setAttribute('numberVal', '123');
    expect(el.numberVal).toBe(123);

    el.setAttribute('numberVal', '0');
    expect(el.numberVal).toBe(0);

    el.removeAttribute('numberVal');
    expect(el.numberVal).toBeNull();
  });

  it('should reflect boolean property to attribute', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.booleanVal = true;
    expect(el.hasAttribute('booleanVal')).toBe(true);
    expect(el.getAttribute('booleanVal')).toBe('');

    el.booleanVal = false;
    expect(el.hasAttribute('booleanVal')).toBe(false);
  });

  it('should reflect attribute to boolean property', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.setAttribute('booleanVal', '');
    expect(el.booleanVal).toBe(true);

    el.removeAttribute('booleanVal');
    expect(el.booleanVal).toBe(false);
  });

  it('should handle custom attribute names (string alias)', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.customNameVal = 'hello';
    expect(el.getAttribute('custom-name')).toBe('hello');

    el.setAttribute('custom-name', 'world');
    expect(el.customNameVal).toBe('world');
  });

  it('should handle custom attribute names (object config)', () => {
    const el = document.createElement('test-attribute') as TestAttributeElement;
    container.appendChild(el);

    el.customNumberVal = 99;
    expect(el.getAttribute('custom-number')).toBe('99');

    el.setAttribute('custom-number', '100');
    expect(el.customNumberVal).toBe(100);
  });
});
