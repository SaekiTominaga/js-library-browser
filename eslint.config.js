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
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: ['packages/*/src/util/**/*.ts'],
		rules: {
			'import/prefer-default-export': 'off',
		},
	},
	{
		files: ['packages/*/src/**/*.test.js'],
		rules: {
			'require-await': 'off',
			'import/no-unassigned-import': 'off',
			'import/no-unresolved': 'off', // Github Actions 環境では /dist/ ファイルが存在しないためテスト不可
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
		files: ['packages/closest-html-page/src/ClosestHTMLPage.test.ts'],
		rules: {
			'import/no-unassigned-import': 'off',
		},
	},
	{
		files: ['packages/input-isbn/src/InputIsbn.test.ts'],
		rules: {
			'@typescript-eslint/unbound-method': 'off',
		},
	},
];
