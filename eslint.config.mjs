import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { flatConfigs } from 'eslint-plugin-import';
import nodePlugin from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

export default [
  js.configs.recommended,
  flatConfigs.recommended,
  nodePlugin.configs['flat/recommended-module'],
  pluginPromise.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.es2024
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        requireConfigFile: false
      }
    },
    rules: {
      'import/order': [2, { 'newlines-between': 'always', alphabetize: { order: 'asc' } }],
      'import/consistent-type-specifier-style': [2, 'prefer-inline'],
      'import/extensions': [2, 'ignorePackages'],
      'import/no-named-as-default-member': 0,
      'import/no-useless-path-segments': 2,
      'import/no-named-as-default': 0,
      'import/group-exports': 2,
      'n/no-unsupported-features/node-builtins': 0,
      'n/no-missing-import': 0,
      'prefer-const': 2,
      'padding-line-between-statements': [2,
      {'blankLine': 'always', 'prev': '*', 'next': 'return'},
      {'blankLine': 'always', 'prev': ['const', 'let', 'var'], 'next': '*'},
      { 'blankLine': 'any', 'prev': ['const', 'let', 'var'], 'next': ['const', 'let', 'var'] }],
      eqeqeq: 2
    }
  }
]