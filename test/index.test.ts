import { describe, it, expect } from 'vitest';
import { getVersion, sayHello } from '../src/index';

describe('om4u global namespace', () => {
  it('should be defined on globalThis', () => {
    expect(globalThis.om4u).toBeDefined();
    expect(globalThis.om4u.version).toBe('1.0.0');
    expect(typeof globalThis.om4u.greet).toBe('function');
  });

  it('should work through exported functions', () => {
    expect(getVersion()).toBe('1.0.0');
    expect(sayHello('World')).toBe('Hello from om4u, World!');
  });

  it('should be directly accessible due to global typing', () => {
    // This tests that TypeScript understands om4u as a global
    expect(om4u.version).toBe('1.0.0');
    expect(om4u.greet('TypeScript')).toBe('Hello from om4u, TypeScript!');
  });
});
