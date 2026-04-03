import { describe, it, expect } from 'vitest';
import '../../src/components/om4utransition.js';

describe('Om4uTransition', () => {
  it('correctly maps attributes to properties', () => {
    const el = document.createElement('om4u-transition') as any;
    el.setAttribute('forward', 'slide-left');
    el.setAttribute('back', 'slide-right');
    el.setAttribute('drilldown', 'zoom-in');
    el.setAttribute('rollup', 'zoom-out');

    expect(el.forward).toBe('slide-left');
    expect(el.back).toBe('slide-right');
    expect(el.drilldown).toBe('zoom-in');
    expect(el.rollup).toBe('zoom-out');
  });
});
