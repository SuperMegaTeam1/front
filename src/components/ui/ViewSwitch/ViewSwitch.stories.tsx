import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { ViewSwitch } from './ViewSwitch';
import { StorybookCanvas } from '@/stories/StorybookFrame';

const meta = {
  title: 'UI/ViewSwitch',
  component: ViewSwitch,
  tags: ['autodocs'],
  args: {
    options: [
      { value: 'today', label: 'Сегодня' },
      { value: 'week', label: 'Неделя' },
    ],
    value: 'today',
    onChange: () => undefined,
  },
} satisfies Meta<typeof ViewSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

function ScheduleViewSwitchStory() {
  const [value, setValue] = useState<'today' | 'week'>('today');

  return (
    <StorybookCanvas maxWidth={420}>
      <ViewSwitch
        options={[
          { value: 'today', label: 'Сегодня' },
          { value: 'week', label: 'Неделя' },
        ]}
        value={value}
        onChange={setValue}
      />
    </StorybookCanvas>
  );
}

function JournalViewSwitchStory() {
  const [value, setValue] = useState<'journal' | 'rating' | 'messages'>('journal');

  return (
    <StorybookCanvas maxWidth={560}>
      <ViewSwitch
        options={[
          { value: 'journal', label: 'Журнал' },
          { value: 'rating', label: 'Рейтинг' },
          { value: 'messages', label: 'Уведомления' },
        ]}
        value={value}
        onChange={setValue}
      />
    </StorybookCanvas>
  );
}

export const ScheduleModes: Story = {
  render: () => <ScheduleViewSwitchStory />,
};

export const ThreeOptions: Story = {
  render: () => <JournalViewSwitchStory />,
};
