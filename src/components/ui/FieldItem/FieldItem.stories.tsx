import type { Meta, StoryObj } from '@storybook/nextjs';
import { FieldItem } from './FieldItem';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import profileStyles from '@/app/(dashboard)/student/profile/profile.module.scss';

const meta = {
  title: 'UI/FieldItem',
  component: FieldItem,
  tags: ['autodocs'],
  args: {
    label: 'Группа',
    value: '09-352',
  },
} satisfies Meta<typeof FieldItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <div className={profileStyles.programGrid}>
        <FieldItem {...args} />
        <FieldItem label="Университет" value="КФУ" />
        <FieldItem label="Направление" value="Программная инженерия" />
      </div>
    </StorybookCanvas>
  ),
};
