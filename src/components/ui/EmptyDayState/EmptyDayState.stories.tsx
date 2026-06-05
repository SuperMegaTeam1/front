import type { Meta, StoryObj } from '@storybook/nextjs';
import { EmptyDayState } from './EmptyDayState';
import { StorybookCanvas } from '@/stories/StorybookFrame';

const meta = {
  title: 'UI/EmptyDayState',
  component: EmptyDayState,
  tags: ['autodocs'],
  args: {
    title: 'На сегодня занятий нет',
    subtitle: '',
  },
} satisfies Meta<typeof EmptyDayState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <EmptyDayState {...args} />
    </StorybookCanvas>
  ),
};
