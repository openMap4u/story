import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/components/om4ustory.js';
import '../../src/components/om4upage.js';
import type { Om4uStory } from '../../src/components/om4ustory.js';
import type { Om4uPage } from '../../src/components/om4upage.js';

describe('Om4uPage', () => {
  let story: Om4uStory;

  beforeEach(() => {
    story = document.createElement('om4u-story') as Om4uStory;
    document.body.appendChild(story);
  });

  afterEach(() => {
    document.body.removeChild(story);
  });

  it('generates a uuid if no id is provided', () => {
    const page = document.createElement('om4u-page') as Om4uPage;
    document.body.appendChild(page);
    expect(page.id).not.toBe('');
    expect(typeof page.id).toBe('string');
    document.body.removeChild(page);
  });

  it('uses provided id', () => {
    const page = document.createElement('om4u-page') as Om4uPage;
    page.setAttribute('id', 'my-custom-id');
    document.body.appendChild(page);

    expect(page.id).toBe('my-custom-id');
    document.body.removeChild(page);
  });

  it('registers itself with the story provider', () => {
    const page = document.createElement('om4u-page') as Om4uPage;
    const registerSpy = vi.spyOn(story, 'registerPage');

    story.appendChild(page);

    expect(registerSpy).toHaveBeenCalledWith(page.id);
  });

  it('renders slot when it is the active page', () => {
    story.innerHTML = `<om4u-page id="page-1">Content 1</om4u-page><om4u-page id="page-2">Content 2</om4u-page>`;

    // flush microtasks
    return Promise.resolve().then(() => {
      const page1 = story.querySelector('#page-1') as Om4uPage;
      const page2 = story.querySelector('#page-2') as Om4uPage;

      expect(page1.shadowRoot!.innerHTML).toContain('<slot></slot>');
      expect(page2.shadowRoot!.innerHTML).not.toContain('<slot></slot>');
    });
  });

  it('updates rendering when active page changes', () => {
    story.innerHTML = `<om4u-page id="page-1">Content 1</om4u-page><om4u-page id="page-2">Content 2</om4u-page>`;

    return Promise.resolve().then(() => {
      const page1 = story.querySelector('#page-1') as Om4uPage;
      const page2 = story.querySelector('#page-2') as Om4uPage;

      story.setActivePage('page-2');

      expect(page1.shadowRoot!.innerHTML).not.toContain('<slot></slot>');
      expect(page2.shadowRoot!.innerHTML).toContain('<slot></slot>');
    });
  });
});
