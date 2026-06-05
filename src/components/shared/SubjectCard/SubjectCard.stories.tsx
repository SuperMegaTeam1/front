import type { Meta, StoryObj } from '@storybook/nextjs';
import { SubjectCard } from './SubjectCard';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockSubjects } from '@/stories/storybookMockData';
import homeStyles from '@/app/(dashboard)/teacher/home/home.module.scss';

const meta = {
  title: 'Shared/SubjectCard',
  component: SubjectCard,
  tags: ['autodocs'],
  args: mockSubjects[0],
} satisfies Meta<typeof SubjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorybookCanvas>
      <div className={homeStyles.subjectsGrid}>
        {mockSubjects.map((subject) => (
          <SubjectCard key={subject.id} {...subject} />
        ))}
      </div>
    </StorybookCanvas>
  ),
};
