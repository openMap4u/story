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

  it('should deeply proxy objects to trigger updates on mutation', () => {
    const signal = new Signal({ a: 1, b: { c: 2 } });
    const mockListener = vi.fn();

    signal.subscribe(mockListener);
    expect(mockListener).toHaveBeenCalledTimes(1);

    signal.value.a = 2;
    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(mockListener).toHaveBeenLastCalledWith({ a: 2, b: { c: 2 } });

    signal.value.b.c = 3;
    expect(mockListener).toHaveBeenCalledTimes(3);
    expect(mockListener).toHaveBeenLastCalledWith({ a: 2, b: { c: 3 } });
  });

  it('should support in-place updates via update method', () => {
    const signal = new Signal({ count: 1 });
    const mockListener = vi.fn();

    signal.subscribe(mockListener);
    expect(mockListener).toHaveBeenCalledTimes(1);

    signal.update(state => {
      state.count += 1;
    });

    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(signal.value.count).toBe(2);
  });

  it('should support returning a new value via update method', () => {
    const signal = new Signal({ count: 1 });
    const mockListener = vi.fn();

    signal.subscribe(mockListener);
    expect(mockListener).toHaveBeenCalledTimes(1);

    signal.update(state => {
      return { count: state.count + 1 };
    });

    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(signal.value.count).toBe(2);

    // Verify deep proxy on returned new object
    signal.value.count = 3;
    expect(mockListener).toHaveBeenCalledTimes(3);
  });

  it('should support derived signals via map method', () => {
    const signal = new Signal({ count: 2 });
    const derivedSignal = signal.map(state => state.count * 2);

    const mockListener = vi.fn();
    derivedSignal.subscribe(mockListener);

    expect(mockListener).toHaveBeenCalledTimes(1);
    expect(mockListener).toHaveBeenLastCalledWith(4);
    expect(derivedSignal.value).toBe(4);

    signal.value.count = 3;
    expect(mockListener).toHaveBeenCalledTimes(2);
    expect(mockListener).toHaveBeenLastCalledWith(6);
    expect(derivedSignal.value).toBe(6);

    signal.update(state => { state.count = 10 });
    expect(mockListener).toHaveBeenCalledTimes(3);
    expect(mockListener).toHaveBeenLastCalledWith(20);
    expect(derivedSignal.value).toBe(20);
  });
});
