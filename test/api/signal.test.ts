import { describe, it, expect, vi } from 'vitest';
import { Signal, createSignal } from '../../src/api/state/signal';

describe('Signal API', () => {
  it('should initialize with a value', () => {
    const signal = createSignal(10);
    expect(signal.value).toBe(10);
  });

  it('should update the value', () => {
    const signal = new Signal('initial');
    signal.value = 'updated';
    expect(signal.value).toBe('updated');
  });

  it('should notify listeners on subscribe and update', () => {
    const signal = new Signal(1);
    const mockListener = vi.fn();

    // Should be called immediately on subscribe with the current value
    const unsubscribe = signal.subscribe(mockListener);
    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenCalledWith(1);

    // Should be called again when value changes
    signal.value = 2;
    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(mockListener).toHaveBeenCalledWith(2);

    // Should NOT be called if the value hasn't actually changed
    signal.value = 2;
    expect(mockListener).toHaveBeenCalledTimes(2);

    // Unsubscribing should stop future notifications
    unsubscribe();
    signal.value = 3;
    expect(mockListener).toHaveBeenCalledTimes(2); // still 2
  });
});
