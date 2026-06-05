import type { Preview, StoryContext } from '@storybook/nextjs';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { rootCssVariables } from '../src/theme/tokens';
import '../src/app/globals.scss';

const setStorybookEnvironment = (context: StoryContext) => {
  const themeMode = context.globals.themeMode === 'dark' ? 'dark' : 'light';

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = themeMode;
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem('theme-mode', themeMode);
  }
};

const storybookCss = `
${rootCssVariables}
body,
.sb-show-main {
  background: transparent !important;
}
`;

const preview: Preview = {
  decorators: [
    (Story, context) => {
      setStorybookEnvironment(context);

      return (
        <>
          <style>{storybookCss}</style>
          <ThemeProvider>
            <Story />
          </ThemeProvider>
        </>
      );
    },
  ],
  globalTypes: {
    themeMode: {
      description: 'Тема интерфейса',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
