import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { WeekNavigation } from './WeekNavigation';
import { StorybookCanvas } from '@/stories/StorybookFrame';

const meta = {
  title: 'UI/WeekNavigation',
  component: WeekNavigation,
  tags: ['autodocs'],
  args: {
    onPrevious: fn(),
    onNext: fn(),
  },
} satisfies Meta<typeof WeekNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas maxWidth={520}>
      <WeekNavigation {...args} />
    </StorybookCanvas>
  ),
};

export const PreviousDisabled: Story = {
  args: {
    isPreviousDisabled: true,
  },
  render: (args) => (
    <StorybookCanvas maxWidth={520}>
      <WeekNavigation {...args} />
    </StorybookCanvas>
  ),
};
