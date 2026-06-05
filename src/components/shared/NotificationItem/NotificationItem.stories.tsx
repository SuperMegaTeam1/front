import type { Meta, StoryObj } from '@storybook/nextjs';
import { NotificationItem } from './NotificationItem';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import { mockNotificationIcon } from '@/stories/storybookMockData';

const meta = {
  title: 'Shared/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  args: {
    title: 'Пара перенесена',
    message: 'Практика по веб-разработке сегодня пройдет в аудитории 1208.',
    time: '10:24',
    icon: mockNotificationIcon,
  },
} satisfies Meta<typeof NotificationItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <NotificationItem {...args} />
    </StorybookCanvas>
  ),
};
