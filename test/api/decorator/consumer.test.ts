import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from '../../../src/api/decorator/provider.js';
import { Consumer } from '../../../src/api/decorator/consumer.js';
import { Signal } from '../../../src/api/state/signal.js';
import { customElement } from '../../../src/api/decorator/customElement.js';

const CONTEXT_KEY = 'TEST_CONSUMER_CONTEXT';

interface ComplexState {
  user: {
    id: number;
    name: string;
  };
  settings: {
    theme: string;
  };
}

@customElement('consumer-provider')
class ConsumerProvider extends HTMLElement {
  @Provider(CONTEXT_KEY)
  state!: Signal<ComplexState>;

  constructor() {
    super();
    this.state = new Signal({
      user: { id: 1, name: 'Alice' },
      settings: { theme: 'dark' },
    });
  }

  updateUser(name: string) {
    this.state.value = { ...this.state.value, user: { ...this.state.value.user, name } };
  }
}

class BaseConsumer extends HTMLElement {
  @Consumer<ComplexState>(CONTEXT_KEY)
  contextSignal?: Signal<ComplexState>;
}

@customElement('test-consumer')
class TestConsumer extends BaseConsumer {
  public receivedStates: ComplexState[] = [];
  private unsub?: () => void;

  connectedCallback() {
    if (this.contextSignal) {
      this.unsub = this.contextSignal.subscribe((val) => {
        this.receivedStates.push(val);
      });
    }
  }

  disconnectedCallback() {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }
}

describe('@Consumer decorator', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should resolve context from ancestor provider using DOM tree', () => {
    const provider = document.createElement('consumer-provider') as ConsumerProvider;
    const consumer = document.createElement('test-consumer') as TestConsumer;

    provider.appendChild(consumer);
    container.appendChild(provider);

    expect(consumer.contextSignal).toBeDefined();
    expect(consumer.receivedStates.length).toBe(1);
    expect(consumer.receivedStates[0].user.name).toBe('Alice');

    // Update parent
    provider.updateUser('Bob');

    expect(consumer.receivedStates.length).toBe(2);
    expect(consumer.receivedStates[1].user.name).toBe('Bob');
  });

  it('should allow setting provider signal directly in a type-safe manner', () => {
    const consumer = document.createElement('test-consumer') as TestConsumer;

    // Inject a mocked signal directly (type safe setter)
    const mockSignal = new Signal<ComplexState>({
      user: { id: 99, name: 'Mock' },
      settings: { theme: 'light' }
    });

    consumer.contextSignal = mockSignal;

    // Append to trigger connectedCallback
    container.appendChild(consumer);

    expect(consumer.contextSignal).toBeDefined();
    expect(consumer.receivedStates.length).toBe(1);
    expect(consumer.receivedStates[0].user.name).toBe('Mock');
  });

  it('should return undefined if no provider is found', () => {
    const consumer = document.createElement('test-consumer') as TestConsumer;

    container.appendChild(consumer);

    expect(consumer.contextSignal).toBeUndefined();
    expect(consumer.receivedStates.length).toBe(0);
  });
});
