/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import globals from 'globals';

import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const jsPlugins = {
  '@next/next': nextPlugin,
  react: reactPlugin,
  'react-hooks': reactHooksPlugin,
  import: importPlugin,
  'jsx-a11y': jsxA11yPlugin,
};
const tsPlugins = {
  ...jsPlugins,
  '@typescript-eslint': tsPlugin,
};
const settings = {
  'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
  'import/resolver': {
    typescript: {
      project: './tsconfig.json',
    },
    node: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
    },
  },
  react: {
    version: 'detect',
  },
};
const jsRules = {
  ...eslint.configs.recommended.rules,
};
const rules = {
  ...jsRules,
  ...tsPlugin.configs.recommended.rules,
  ...jsxA11yPlugin.configs.recommended.rules,
  ...importPlugin.configs.recommended.rules,
  ...reactPlugin.configs.recommended.rules,
  // ...reactHooksPlugin.configs.recommended.rules,
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs['core-web-vitals'].rules,

  '@next/next/no-img-element': 'off',

  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-use-before-define': 'warn',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-explicit-any': 'off',

  'import/no-extraneous-dependencies': [
    'error',
    { packageDir: './' },
  ],
  'import/extensions': [
    'error',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    },
  ],
  'import/no-relative-packages': 'off',

  'react/function-component-definition': 'off',
  'react/display-name': 'off',
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
  'react/jsx-props-no-spreading': 'off',
  'react/require-default-props': 'off',

  'linebreak-style': ['error', 'unix'],
  'no-shadow': 'off',
  'no-restricted-exports': 'off',
  'no-unused-vars': 'off',
};

export default defineConfig([
  ...compat.extends('airbnb'),
  {
    ignores: [
      'src/lib_components/**/*.d.ts',
      'src/lib_components/remoteAssets/**',
      'src/lib_components/vendor/',
      'src/sampleData/',
      'src/**/__tests__',
      'src/**/__mocks__',
      'lib/',
      '.next/',
      'build/',
      'node_modules/',
      'test-coverage/',
    ],
  },
  {
    files: [
      '*.{js,mjs}',
      'scripts/**/*.{js,mjs}',
      'test/**/*.{js,mjs}',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: jsPlugins,
    settings,
    rules: {
      ...jsRules,
      'import/no-extraneous-dependencies': [
        'error',
        { packageDir: './', devDependencies: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true,
          experimentalObjectRestSpread: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: tsPlugins,
    settings,
    rules,
  },
  {
    files: ['src/lib_components/workers/*.js'],
    rules: {
      'prefer-object-spread': 'off',
    },
  },
  {
    files: [
      'src/lib_components/**/*/StyleGuide.*',
      'src/App.jsx',
      'src/components/*',
      'src/__mocks__/*',
    ],
    rules: {
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',

      'react/jsx-one-expression-per-line': 'off',

      'max-len': 'off',
    },
  },
]);
