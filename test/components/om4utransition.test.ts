import { describe, it, expect } from 'vitest';
import '../../src/components/om4utransition.js';

describe('Om4uTransition', () => {
  it('correctly maps attributes to properties', () => {
    const el = document.createElement('om4u-transition') as any;
    el.setAttribute('id', 'forward');
    el.setAttribute('transition', 'slide-left');

    expect(el.id).toBe('forward');
    expect(el.transition).toBe('slide-left');
  });
});
