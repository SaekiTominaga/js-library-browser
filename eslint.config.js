// @ts-check
/* eslint-disable import/no-unresolved */

import w0sConfig from '@w0s/eslint-config';
import pluginJest from 'eslint-plugin-jest';
import pluginPlaywright from 'eslint-plugin-playwright';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

/** @type {import("eslint").Linter.Config[]} */
export default defineConfig([
	...w0sConfig,
	{
		ignores: ['packages/*/dist'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.es2022,
			},
			parserOptions: {
				sourceType: 'module',
			},
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ['e2e/*.spec.ts'],
		extends: [pluginPlaywright.configs['flat/recommended']],
		rules: {
			'playwright/no-skipped-test': 'off',
			'playwright/prefer-to-have-count': 'off',
		},
	},
	{
		files: ['packages/*/src/**/*.ts'],
		rules: {
			'no-console': [
				'warn',
				{
					allow: ['info', 'error'],
				},
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false,
				},
			],
		},
	},
	{
		files: ['packages/*/src/**/*.test.ts'],
		plugins: { jest: pluginJest },
		extends: [pluginJest.configs['flat/recommended']],
		rules: {
			'import/no-extraneous-dependencies': 'off', // Allow imports from `@jest/globals`
		},
	},
	{
		/* Custom elements */
		files: [
			'packages/footnote-reference-popover/src/custom-element/Popover.ts',
			'packages/input-file-preview/src/custom-element/InputFilePreview.ts',
			'packages/tab/src/custom-element/Tab.ts',
		],
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['packages/button-clipboard/src/util/html.ts'],
		rules: {
			'@typescript-eslint/no-unnecessary-type-assertion': 'off', // TypeScript 5.9
		},
	},
	{
		files: ['packages/button-confirm/src/event/**/*.ts'],
		rules: {
			'no-alert': 'off',
		},
	},
	{
		files: ['packages/input-file-preview/src/util/errorMessage.test.ts'],
		rules: {
			'no-template-curly-in-string': 'off',
		},
	},
	{
		files: ['packages/table-cell-ditto/src/TableCellDitto.ts'],
		rules: {
			'@typescript-eslint/no-unnecessary-condition': 'off', // TypeScript 5.9
		},
	},
	{
		files: ['jest.setup.js'],
		rules: {
			'no-empty-function': 'off',
			'no-new': 'off',
			'no-underscore-dangle': 'off',
		},
	},
]);
