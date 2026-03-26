import { describe, it, expect, vi } from 'vitest';
import { Signal, createSignal } from './signal';

describe('Signal Pattern Implementation', () => {
    describe('Signal Class', () => {
        it('should initialize with the provided value', () => {
            const signal = new Signal(10);
            expect(signal.value).toBe(10);
        });

        it('should notify subscribers when value changes', () => {
            const signal = new Signal('initial');
            const mockSubscriber = vi.fn();

            signal.subscribe(mockSubscriber);

            expect(mockSubscriber).toHaveBeenCalledWith('initial');

            signal.value = 'changed';

            expect(mockSubscriber).toHaveBeenCalledWith('changed');
            expect(mockSubscriber).toHaveBeenCalledTimes(2);
        });

        it('should not notify subscribers if value does not change', () => {
            const signal = new Signal('initial');
            const mockSubscriber = vi.fn();

            signal.subscribe(mockSubscriber);

            signal.value = 'initial'; // Setting same value

            expect(mockSubscriber).toHaveBeenCalledTimes(1); // Only the initial call
        });

        it('should return an unsubscribe function', () => {
            const signal = new Signal(1);
            const mockSubscriber = vi.fn();

            const unsubscribe = signal.subscribe(mockSubscriber);

            unsubscribe();

            signal.value = 2;

            expect(mockSubscriber).toHaveBeenCalledTimes(1); // Only the initial call, not the change to 2
        });
    });

    describe('createSignal function', () => {
        it('should return a getter, setter, and subscriber', () => {
            const [get, set, subscribe] = createSignal(100);

            expect(get()).toBe(100);

            const mockSubscriber = vi.fn();
            subscribe(mockSubscriber);

            set(200);

            expect(get()).toBe(200);
            expect(mockSubscriber).toHaveBeenCalledWith(200);
        });
    });
});
