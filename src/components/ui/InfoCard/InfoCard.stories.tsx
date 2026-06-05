import type { Meta, StoryObj } from '@storybook/nextjs';
import { InfoCard } from './InfoCard';
import { FieldItem } from '../FieldItem/FieldItem';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockInfoIcons } from '@/stories/storybookMockData';
import profileStyles from '@/app/(dashboard)/student/profile/profile.module.scss';

const meta = {
  title: 'UI/InfoCard',
  component: InfoCard,
  tags: ['autodocs'],
  args: {
    title: 'Учебная программа',
    icon: mockInfoIcons.school,
    children: (
      <div className={profileStyles.programGrid}>
        <FieldItem label="Группа" value="09-352" />
        <FieldItem label="Университет" value="КФУ" />
        <FieldItem label="Направление" value="Программная инженерия" />
        <FieldItem label="Курс" value="3 курс" />
        <FieldItem label="Семестр" value="6 семестр" />
        <FieldItem label="Форма обучения" value="Очная форма" />
      </div>
    ),
  },
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <InfoCard {...args} />
    </StorybookCanvas>
  ),
};
