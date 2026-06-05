import type { Meta, StoryObj } from '@storybook/nextjs';
import { DayDivider } from './DayDivider';
import { StorybookCanvas } from '@/stories/StorybookFrame';

const meta = {
  title: 'UI/DayDivider',
  component: DayDivider,
  tags: ['autodocs'],
  args: {
    label: 'Четверг, 4 июня',
  },
} satisfies Meta<typeof DayDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <DayDivider {...args} />
    </StorybookCanvas>
  ),
};
