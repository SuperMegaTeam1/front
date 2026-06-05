import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { PageHero } from './PageHero';
import { ViewSwitch } from '../ViewSwitch/ViewSwitch';
import { WeekNavigation } from '../WeekNavigation/WeekNavigation';
import { StorybookCanvas } from '@/stories/StorybookFrame';
import scheduleStyles from '@/app/(dashboard)/student/schedule/schedule.module.scss';

type ScheduleView = 'today' | 'week';

const VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

const meta = {
  title: 'UI/PageHero',
  component: PageHero,
  tags: ['autodocs'],
  args: {
    title: 'Расписание',
    subtitle: 'Текущий семестр',
  },
} satisfies Meta<typeof PageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

function ScheduleHeroStory() {
  const [view, setView] = useState<ScheduleView>('week');

  const heroMeta = view === 'today' ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>СРЕДА, 4 ИЮНЯ</span>
    </>
  ) : (
    <span className={scheduleStyles.weekMeta}>
      <strong className={scheduleStyles.weekMetaLabel}>ЧЕТНАЯ НЕДЕЛЯ</strong>
      <span className={scheduleStyles.weekMetaPeriod}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
        <span>1-7 ИЮНЯ</span>
      </span>
    </span>
  );

  const heroCenter = view === 'week' ? (
    <WeekNavigation
      onPrevious={() => undefined}
      onNext={() => undefined}
    />
  ) : undefined;

  return (
    <StorybookCanvas>
      <PageHero
        className={scheduleStyles.scheduleHero}
        title="Расписание"
        meta={heroMeta}
        center={heroCenter}
        action={<ViewSwitch options={VIEW_OPTIONS} value={view} onChange={setView} />}
      />
    </StorybookCanvas>
  );
}

export const Default: Story = {
  render: (args) => (
    <StorybookCanvas>
      <PageHero {...args} />
    </StorybookCanvas>
  ),
};

export const ScheduleHeader: Story = {
  render: () => <ScheduleHeroStory />,
};
