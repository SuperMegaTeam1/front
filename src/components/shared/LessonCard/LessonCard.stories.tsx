import type { Meta, StoryObj } from '@storybook/nextjs';
import { LessonCard } from './LessonCard';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockLessonCards } from '@/stories/storybookMockData';

const meta = {
  title: 'Shared/LessonCard',
  component: LessonCard,
  tags: ['autodocs'],
  args: mockLessonCards[0],
} satisfies Meta<typeof LessonCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <LessonCard {...args} />
    </StorybookCanvas>
  ),
};
