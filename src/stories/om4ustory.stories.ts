import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../src/components/om4ustory.js';
import '../../src/components/om4upage.js';
import '../../src/components/om4utransition.js';

const meta: Meta = {
  title: 'Components/Om4uStory',
  component: 'om4u-story',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const styles = html`
  <style>
    /* Forward transition */
    html[data-transition="slide-left"]::view-transition-old(root) {
      animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-out-left;
    }
    html[data-transition="slide-left"]::view-transition-new(root) {
      animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-in-from-right;
    }

    /* Back transition */
    html[data-transition="slide-right"]::view-transition-old(root) {
      animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-out-right;
    }
    html[data-transition="slide-right"]::view-transition-new(root) {
      animation: 0.5s cubic-bezier(0.4, 0, 0.2, 1) both slide-in-from-left;
    }

    @keyframes slide-out-left {
      to { transform: translateX(-100%); opacity: 0; }
    }
    @keyframes slide-in-from-right {
      from { transform: translateX(100%); opacity: 0; }
    }
    @keyframes slide-out-right {
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes slide-in-from-left {
      from { transform: translateX(-100%); opacity: 0; }
    }
  </style>
`;

export const Default: Story = {
  render: () => {
    const handleSetPage = (id: string, action: 'forward'|'back') => (e: Event) => {
      const storyEl = (e.target as HTMLElement).closest('.story-container')?.querySelector('om4u-story') as any;
      if (storyEl && storyEl.setActivePage) {
        storyEl.setActivePage(id, action);
      }
    };

    return html`
      ${styles}
      <div class="story-container" style="font-family: sans-serif;">
        <div style="margin-bottom: 20px;">
          <button @click=${handleSetPage('page-1', 'back')}>Page 1 (Back)</button>
          <button @click=${handleSetPage('page-2', 'forward')}>Page 2 (Forward)</button>
          <button @click=${handleSetPage('page-3', 'forward')}>Page 3 (Forward)</button>
        </div>

        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 4px; overflow: hidden; position: relative; height: 150px;">
          <om4u-story>
            <om4u-transition forward="slide-left" back="slide-right"></om4u-transition>
            <om4u-page id="page-1">
              <h2>Welcome to Page 1</h2>
              <p>This is the first page of our application.</p>
            </om4u-page>
            <om4u-page id="page-2">
              <h2>Welcome to Page 2</h2>
              <p>This is the second page.</p>
            </om4u-page>
            <om4u-page id="page-3">
              <h2>Welcome to Page 3</h2>
              <p>And here is the third page!</p>
            </om4u-page>
          </om4u-story>
        </div>
      </div>
    `;
  },
};
