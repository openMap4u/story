// We need a DOM environment for these tests.
// vitest config should include jsdom environment
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AbstractProviderComponent } from '../../src/components/AbstractProvider.js';
import { AbstractConsumerComponent } from '../../src/components/AbstractConsumer.js';

// Concrete implementations for testing
class TestProvider extends AbstractProviderComponent<string> {
  constructor() {
    super('Initial State');
  }

  // Expose the protected update for tests
  public changeState(newVal: string) {
    this.updateSignal(newVal);
  }
}

class TestConsumer extends AbstractConsumerComponent<string> {
  // Mock function to track calls
  public handleUpdate = vi.fn();

  protected onSignalUpdate(value: string): void {
    this.handleUpdate(value);
  }
}

// Register the custom elements
customElements.define('test-provider', TestProvider);
customElements.define('test-consumer', TestConsumer);

describe('Abstract Web Components with Context API', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    vi.clearAllMocks();
  });

  it('should pass signal updates from provider to consumer via DOM context', () => {
    // Setup the DOM structure
    const provider = document.createElement('test-provider') as TestProvider;
    const consumer = document.createElement('test-consumer') as TestConsumer;

    // Nest the consumer inside the provider
    provider.appendChild(consumer);
    container.appendChild(provider);

    // Initial value is "Initial State" from constructor
    // The consumer's connectedCallback() handles the subscription
    // and instantly fires the listener with current value.
    expect(consumer.handleUpdate).toHaveBeenCalledWith('Initial State');
    expect(consumer.handleUpdate).toHaveBeenCalledTimes(1);

    // Now let's change the state in the provider
    provider.changeState('Updated State');

    // The consumer should receive the new value
    expect(consumer.handleUpdate).toHaveBeenCalledWith('Updated State');
    expect(consumer.handleUpdate).toHaveBeenCalledTimes(2);
  });

  it('should handle missing providers gracefully', () => {
    const consumer = document.createElement('test-consumer') as TestConsumer;

    // Warn spy since we expect a warning when missing a provider
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Attach standalone consumer (no provider in DOM hierarchy)
    container.appendChild(consumer);

    // `onSignalUpdate` should NOT be called since there is no signal to subscribe to
    expect(consumer.handleUpdate).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Signal provider not found for AbstractConsumerComponent');

    consoleSpy.mockRestore();
  });

  it('should unsubscribe from signal when removed from DOM', () => {
    const provider = document.createElement('test-provider') as TestProvider;
    const consumer = document.createElement('test-consumer') as TestConsumer;

    provider.appendChild(consumer);
    container.appendChild(provider);

    expect(consumer.handleUpdate).toHaveBeenCalledTimes(1);

    // Remove the consumer from the DOM, firing disconnectedCallback
    consumer.remove();

    // Provider state changes should NOT notify the detached consumer
    provider.changeState('New State after detach');

    expect(consumer.handleUpdate).toHaveBeenCalledTimes(1); // Still 1
  });
});
