import type { Meta, StoryObj } from '@storybook/nextjs';
import { RatingTable } from './RatingTable';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockRatingRows } from '@/stories/storybookMockData';

const meta = {
  title: 'Shared/RatingTable',
  component: RatingTable,
  tags: ['autodocs'],
  args: {
    rows: mockRatingRows,
    visibleCount: mockRatingRows.length,
    totalCount: mockRatingRows.length,
  },
} satisfies Meta<typeof RatingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <RatingTable {...args} />
    </StorybookCanvas>
  ),
};

export const WithShowMore: Story = {
  args: {
    rows: mockRatingRows.slice(0, 3),
    visibleCount: 3,
    totalCount: mockRatingRows.length,
    onShowMore: () => undefined,
  },
  render: () => (
    <StorybookCanvas>
      <RatingTable
        rows={mockRatingRows.slice(0, 3)}
        visibleCount={3}
        totalCount={mockRatingRows.length}
        onShowMore={() => undefined}
      />
    </StorybookCanvas>
  ),
};
