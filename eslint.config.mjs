import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    // Правило от Дмитрия (ревью PR #1): булевы переменные должны начинаться
    // с глагола — is/has/can/should/will/did. Подробнее — wiki/sources/pr-1-review.md.
    //
    // Применяется только к variable и parameter — свойства (property)
    // не трогаем, чтобы не конфликтовать с соглашениями MUI/чужих API
    // (disabled, open, selected, loading и т.п.).
    //
    // Для селектора по `types` нужен type-aware linting — включаем projectService.
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
        },
        {
          selector: 'parameter',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
        },
      ],
    },
  },
]);
