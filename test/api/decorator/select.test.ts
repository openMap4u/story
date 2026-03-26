import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Provider } from '../../../src/api/decorator/provider.js';
import { Select } from '../../../src/api/decorator/select.js';
import { Signal } from '../../../src/api/state/signal.js';
import { customElement } from '../../../src/api/decorator/customElement.js';

const CONTEXT_KEY = 'TEST_SELECT_CONTEXT';

interface TestState {
  foo: string;
  bar: number;
}

@customElement('select-provider')
class SelectProvider extends HTMLElement {
  @Provider(CONTEXT_KEY)
  state!: Signal<TestState>;

  constructor() {
    super();
    this.state = new Signal({ foo: 'initial', bar: 100 });
  }

  updateState(newState: Partial<TestState>) {
    this.state.value = { ...this.state.value, ...newState };
  }
}

@customElement('select-consumer')
class SelectConsumer extends HTMLElement {
  @Select<TestState, 'foo'>(CONTEXT_KEY, 'foo')
  fooSignal?: Signal<string>;

  @Select<TestState, 'bar'>(CONTEXT_KEY, 'bar')
  barSignal?: Signal<number>;

  public fooUpdates: string[] = [];
  public barUpdates: number[] = [];

  private unsubFoo?: () => void;
  private unsubBar?: () => void;

  connectedCallback() {
    // We expect the consumer code to subscribe to the derived signal on connect
    if (this.fooSignal) {
      this.unsubFoo = this.fooSignal.subscribe((v) => this.fooUpdates.push(v));
    }
    if (this.barSignal) {
      this.unsubBar = this.barSignal.subscribe((v) => this.barUpdates.push(v));
    }
  }

  disconnectedCallback() {
    // And unsubscribe from the derived signal on disconnect
    if (this.unsubFoo) {
      this.unsubFoo();
      this.unsubFoo = undefined;
    }
    if (this.unsubBar) {
      this.unsubBar();
      this.unsubBar = undefined;
    }
  }
}

describe('@Select decorator', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should extract a specific property signal from the provided signal', () => {
    const provider = document.createElement('select-provider') as SelectProvider;
    const consumer = document.createElement('select-consumer') as SelectConsumer;

    provider.appendChild(consumer);
    container.appendChild(provider);

    // Assert initial values were pushed
    expect(consumer.fooUpdates).toEqual(['initial']);
    expect(consumer.barUpdates).toEqual([100]);

    // Update only the foo property
    provider.updateState({ foo: 'updated-foo' });

    expect(consumer.fooUpdates).toEqual(['initial', 'updated-foo']);
    expect(consumer.barUpdates).toEqual([100]);

    // Update only the bar property
    provider.updateState({ bar: 200 });

    expect(consumer.fooUpdates).toEqual(['initial', 'updated-foo']);
    expect(consumer.barUpdates).toEqual([100, 200]);
  });

  it('should unsubscribe from parent and clear cache on disconnect', () => {
    const provider1 = document.createElement('select-provider') as SelectProvider;
    provider1.state.value = { foo: 'P1', bar: 1 };

    const provider2 = document.createElement('select-provider') as SelectProvider;
    provider2.state.value = { foo: 'P2', bar: 2 };

    const consumer = document.createElement('select-consumer') as SelectConsumer;

    container.appendChild(provider1);
    container.appendChild(provider2);

    // Mount under provider1
    provider1.appendChild(consumer);
    expect(consumer.fooUpdates).toEqual(['P1']);

    // Remove from DOM, disconnecting it
    consumer.remove();

    // Change provider1's state, consumer should not receive it from derived signal
    provider1.updateState({ foo: 'P1-updated' });
    expect(consumer.fooUpdates).toEqual(['P1']);

    // Mount under provider2 (re-parenting)
    provider2.appendChild(consumer);
    // fooUpdates should now append P2 since connectedCallback ran again
    expect(consumer.fooUpdates).toEqual(['P1', 'P2']);

    // Update provider2's state
    provider2.updateState({ foo: 'P2-updated' });
    expect(consumer.fooUpdates).toEqual(['P1', 'P2', 'P2-updated']);
  });
});
