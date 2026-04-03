import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../../src/components/om4ustory.js';
import type { Om4uStory } from '../../src/components/om4ustory.js';

describe('Om4uStory', () => {
  let element: Om4uStory;

  beforeEach(() => {
    element = document.createElement('om4u-story') as Om4uStory;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('initializes with null activePageId', () => {
    expect((element as any)._signal.value.activePageId).toBeNull();
  });

  it('registers the first page as active', () => {
    element.registerPage('page-1');
    expect((element as any)._signal.value.activePageId).toBe('page-1');
  });

  it('does not overwrite activePageId on subsequent registrations', () => {
    element.registerPage('page-1');
    element.registerPage('page-2');
    expect((element as any)._signal.value.activePageId).toBe('page-1');
  });

  it('sets active page manually', () => {
    element.registerPage('page-1');
    element.setActivePage('page-2');
    expect((element as any)._signal.value.activePageId).toBe('page-2');
  });

  it('uses document.startViewTransition if available', () => {
    let transitionCallback: (() => void) | null = null;
    let transitionCalled = false;

    // Mock document.startViewTransition
    (document as any).startViewTransition = (cb: () => void) => {
      transitionCalled = true;
      transitionCallback = cb;
      return { finished: Promise.resolve() };
    };

    element.registerPage('page-1');
    element.setActivePage('page-2');

    expect(transitionCalled).toBe(true);
    // The signal shouldn't be updated until the callback runs
    expect((element as any)._signal.value.activePageId).toBe('page-1');

    if (transitionCallback) {
        (transitionCallback as () => void)();
    }
    expect((element as any)._signal.value.activePageId).toBe('page-2');

    // Cleanup
    delete (document as any).startViewTransition;
  });

  it('applies action transition to document element when configured', async () => {
    let transitionCallback: (() => void) | null = null;
    let finishedResolve: () => void;
    const finishedPromise = new Promise<void>((resolve) => {
      finishedResolve = resolve;
    });

    (document as any).startViewTransition = (cb: () => void) => {
      transitionCallback = cb;
      return { finished: finishedPromise };
    };

    const transitionConfig = document.createElement('om4u-transition');
    transitionConfig.setAttribute('id', 'forward');
    transitionConfig.setAttribute('transition', 'slide-fwd');
    element.appendChild(transitionConfig);

    element.registerPage('page-1');
    element.setActivePage('page-2', 'forward');

    expect(document.documentElement.getAttribute('data-transition')).toBe('slide-fwd');

    if (transitionCallback) {
      (transitionCallback as () => void)();
    }
    expect((element as any)._signal.value.activePageId).toBe('page-2');

    // Resolve the finished promise and wait for microtasks
    finishedResolve!();
    await Promise.resolve();

    expect(document.documentElement.hasAttribute('data-transition')).toBe(false);

    delete (document as any).startViewTransition;
  });
});
