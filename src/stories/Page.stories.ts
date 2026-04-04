import type { Meta, StoryObj } from '@storybook/web-components-vite';

import * as HeaderStories from './Header.stories.js';
import type { PageProps } from './Page.js';
import { Page } from './Page.js';

const meta = {
  title: 'Example/Page',
  render: (args: PageProps) => Page(args),
} satisfies Meta<PageProps>;

export default meta;
type Story = StoryObj<PageProps>;

export const LoggedIn: Story = {
  args: {
    // More on composing args: https://storybook.js.org/docs/writing-stories/args#args-composition
    ...HeaderStories.LoggedIn.args,
  },
};

export const LoggedOut: Story = {
  args: {
    ...HeaderStories.LoggedOut.args,
  },
};
