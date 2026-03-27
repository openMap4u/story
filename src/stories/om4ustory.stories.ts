import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '../../src/components/om4ustory.js';
import '../../src/components/om4upage.js';

const meta: Meta = {
  title: 'Components/Om4uStory',
  component: 'om4u-story',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const handleSetPage = (id: string) => (e: Event) => {
      const storyEl = (e.target as HTMLElement).closest('.story-container')?.querySelector('om4u-story') as any;
      if (storyEl && storyEl.setActivePage) {
        storyEl.setActivePage(id);
      }
    };

    return html`
      <div class="story-container" style="font-family: sans-serif;">
        <div style="margin-bottom: 20px;">
          <button @click=${handleSetPage('page-1')}>Page 1</button>
          <button @click=${handleSetPage('page-2')}>Page 2</button>
          <button @click=${handleSetPage('page-3')}>Page 3</button>
        </div>

        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 4px;">
          <om4u-story>
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
