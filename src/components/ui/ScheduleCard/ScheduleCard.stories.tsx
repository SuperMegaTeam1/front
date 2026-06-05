import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn } from 'storybook/test';
import { ScheduleCard } from './ScheduleCard';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockScheduleCards } from '@/stories/storybookMockData';

const meta = {
  title: 'UI/ScheduleCard',
  component: ScheduleCard,
  tags: ['autodocs'],
  args: {
    ...mockScheduleCards[0],
    onMore: fn(),
  },
} satisfies Meta<typeof ScheduleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <ScheduleCard {...args} />
    </StorybookCanvas>
  ),
};
