import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import checkFile from 'eslint-plugin-check-file';
import _import from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import typescriptEslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const baseDirectory = path.dirname(__filename);

const flatCompat = new FlatCompat({
  baseDirectory,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default typescriptEslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...typescriptEslint.configs.recommended,
  ...flatCompat.extends('@remotion'),
  {
    ignores: ['**/node_modules', '**/public', '**/dist', '**/build', '**/coverage', '**/.husky'],
  },
  ...fixupConfigRules(
    flatCompat.extends(
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:import/typescript'
    )
  ),
  {
    plugins: {
      react: fixupPluginRules(reactPlugin),
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      import: fixupPluginRules(_import),
      'check-file': checkFile,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptEslint.parser,
      parserOptions: {
        // https://github.com/typescript-eslint/typescript-eslint/issues/2303
        // https://typescript-eslint.io/blog/announcing-typescript-eslint-v8-beta
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      // import resolver only needed for `eslint-plugin-import`
      // https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    // rules: https://eslint.org/docs/latest/rules/
    rules: {
      // base rule must be disabled as it can report incorrect errors
      // https://typescript-eslint.io/rules/no-unused-vars/#how-to-use
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports', // allows e.g. import type { ... } from 'react' and import { ...} from 'react' and the first import type is completely removed by the compiler
        },
      ], // automatically detects if imported module is type or not and formats if needed
      'react/jsx-props-no-spreading': 'off',
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      'accessor-pairs': 'warn',
      'capitalized-comments': 'off',
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/**/': 'KEBAB_CASE',
        },
      ],
      'default-case': 'warn',
      'default-case-last': 'error',
      'dot-notation': 'warn',
      eqeqeq: 'error',
      'func-style': ['error', 'expression'],
      'import/no-duplicates': 'error',
      'max-depth': ['warn', 3],
      'max-nested-callbacks': ['warn', 3],
      'no-console': 'warn',
      'no-else-return': [
        'error',
        {
          allowElseIf: false,
        },
      ],
      'no-eq-null': 'error',
      'no-lonely-if': 'warn',
      'no-nested-ternary': 'warn',
      'no-shadow': 'off',
      'no-template-curly-in-string': 'warn',
      'no-unreachable-loop': 'warn',
      'no-use-before-define': 'warn',
      'no-useless-rename': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-template': 'error',
      'require-await': 'error',
    },
  }
);
