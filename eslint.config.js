// @ts-check

import globals from 'globals';
import w0sConfig from '@w0s/eslint-config';

/** @type {import("@typescript-eslint/utils/ts-eslint").FlatConfig.ConfigArray} */
export default [
	...w0sConfig,
	{
		ignores: ['@types', 'packages/*/dist'],
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
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['packages/*/src/**/*.test.ts'],
		rules: {
			'import/no-unassigned-import': 'off',
		},
	},
	{
		files: ['packages/*/src/index.ts'],
		rules: {
			'no-new': 'off',
		},
	},
	{
		files: ['packages/*/src/index.test.ts'],
		rules: {
			'@typescript-eslint/no-confusing-void-expression': 'off',
		},
	},
	{
		files: ['packages/button-clipboard/src/util/html.ts'],
		rules: {
			'@typescript-eslint/no-unnecessary-type-assertion': 'off', // TypeScript 5.9
		},
	},
	{
		files: ['packages/button-confirm/src/ButtonConfirm.ts'],
		rules: {
			'no-alert': 'off',
		},
	},
	{
		files: ['packages/closest-html-page/src/ClosestHTMLPage.ts'],
		rules: {
			'no-await-in-loop': 'off',
			'no-continue': 'off',
		},
	},
	{
		files: ['packages/input-file-preview/src/util/errorMessage.test.ts'],
		rules: {
			'no-template-curly-in-string': 'off',
		},
	},
	{
		files: ['packages/input-isbn/src/InputIsbn.test.ts'],
		rules: {
			'@typescript-eslint/unbound-method': 'off',
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
			'no-new': 'off',
		},
	},
];
