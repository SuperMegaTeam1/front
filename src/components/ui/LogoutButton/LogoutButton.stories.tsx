import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { LogoutButton } from './LogoutButton';
import { StorybookCanvas } from '@/stories/StorybookFrame';

const meta = {
  title: 'UI/LogoutButton',
  component: LogoutButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof LogoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas maxWidth={360}>
      <LogoutButton {...args} />
    </StorybookCanvas>
  ),
};
