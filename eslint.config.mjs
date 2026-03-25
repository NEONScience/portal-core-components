/* eslint-disable no-underscore-dangle */
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
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
  ...nextPlugin.configs.recommended.rules,
  ...nextPlugin.configs['core-web-vitals'].rules,

  '@next/next/no-img-element': 'off',

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
  'import/no-relative-packages': 0,

  'react/function-component-definition': 0,
  'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
  'react/jsx-props-no-spreading': 0,
  'react/no-unknown-property': ['error', { ignore: ['css'] }],
  'react/require-default-props': 'off',
  'react/jsx-uses-react': 'off',
  'react/react-in-jsx-scope': 'off',

  'linebreak-style': ['error', 'unix'],
  'no-restricted-exports': 0,
  'no-shadow': 'off',
  'no-unused-vars': 'off',
};
const tsRules = {
  ...jsRules,

  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-use-before-define': 'warn',

  'import/no-extraneous-dependencies': [
    'error',
    { packageDir: './' },
  ],
};

export default defineConfig([
  ...compat.extends('airbnb', 'plugin:jsx-a11y/recommended'),
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
    rules: tsRules,
  },
  {
    files: ['src/lib_components/workers/*.js'],
    rules: {
      'prefer-object-spread': 0,
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
