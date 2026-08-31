import config from '@w0s/oxlint-config/browser';
import { defineConfig } from 'oxlint';

export default defineConfig({
	extends: [config],
	options: {
		typeAware: true,
		typeCheck: true,
	},
	overrides: [
		{
			files: ['e2e/*.spec.ts'],
			jsPlugins: [
				{
					name: 'playwright',
					specifier: 'eslint-plugin-playwright',
				},
			],
			rules: {
				'unicorn/max-nested-calls': 'off',
				'playwright/consistent-spacing-between-blocks': 'error', // ✅
				'playwright/expect-expect': 'error', // ✅
				'playwright/max-nested-describe': 'error', // ✅
				'playwright/missing-playwright-await': 'error', // ✅
				'playwright/no-commented-out-tests': 'error',
				'playwright/no-conditional-expect': 'error', // ✅
				'playwright/no-conditional-in-test': 'error', // ✅
				'playwright/no-duplicate-hooks': 'error', // ✅
				'playwright/no-duplicate-slow': 'error', // ✅
				'playwright/no-element-handle': 'error', // ✅
				'playwright/no-eval': 'error', // ✅
				'playwright/no-focused-test': 'error', // ✅
				'playwright/no-force-option': 'error', // ✅
				'playwright/no-get-by-title': 'error',
				'playwright/no-nested-step': 'error', // ✅
				'playwright/no-networkidle': 'error', // ✅
				'playwright/no-page-pause': 'error', // ✅
				'playwright/no-restricted-locators': 'error',
				'playwright/no-restricted-matchers': 'error',
				'playwright/no-restricted-roles': 'error',
				'playwright/no-skipped-test': 'off', // ✅
				'playwright/no-slowed-test': 'error',
				'playwright/no-standalone-expect': 'error', // ✅
				'playwright/no-unnecessary-assertions': 'error', // ✅
				'playwright/no-unsafe-references': 'error', // ✅
				'playwright/no-unused-locators': 'error', // ✅
				'playwright/no-useless-await': 'error', // ✅
				'playwright/no-useless-not': 'error', // ✅
				'playwright/no-wait-for-navigation': 'error', // ✅
				'playwright/no-wait-for-selector': 'error', // ✅
				'playwright/no-wait-for-timeout': 'error', // ✅
				'playwright/prefer-comparison-matcher': 'error',
				'playwright/prefer-equality-matcher': 'error',
				'playwright/prefer-hooks-in-order': 'error', // ✅
				'playwright/prefer-hooks-on-top': 'error', // ✅
				'playwright/prefer-native-locators': 'error',
				'playwright/prefer-locator': 'error', // ✅
				'playwright/prefer-strict-equal': 'error',
				'playwright/prefer-to-be': 'error',
				'playwright/prefer-to-contain': 'error',
				'playwright/prefer-to-have-count': 'error', // ✅
				'playwright/prefer-to-have-length': 'error', // ✅
				'playwright/prefer-web-first-assertions': 'error', // ✅
				'playwright/require-hook': 'error',
				'playwright/require-to-pass-timeout': 'error',
				'playwright/require-to-throw-message': 'error',
				'playwright/valid-describe-callback': 'error', // ✅
				'playwright/valid-expect-in-promise': 'error', // ✅
				'playwright/valid-expect': 'error', // ✅
				'playwright/valid-title': 'error', // ✅
				'playwright/valid-test-tags': 'error', // ✅
				'safely-storage/try-catch': 'off',
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
			},
		},
		{
			files: ['packages/*/src/**/*.test.ts'],
			plugins: ['jest'],
			rules: {
				'jest/consistent-test-it': ['error', { withinDescribe: 'test' }],
				'jest/max-expects': 'off',
				'jest/no-hooks': 'off',
				'jest/prefer-expect-assertions': 'off',
				'jest/prefer-lowercase-title': 'off',
				'jest/require-top-level-describe': 'off',
			},
		},
		{
			files: ['packages/*/src/*.ts'],
			rules: {
				'no-void': 'off',
			},
		},
		{
			files: ['packages/*/src/index.test.ts'],
			rules: {
				'unicorn/prefer-query-selector': 'off',
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
				'typescript/no-non-null-assertion': 'off',
			},
		},
		{
			files: ['packages/button-confirm/src/event/click.ts'],
			rules: {
				'no-alert': 'off',
			},
		},
		{
			files: ['packages/input-file-preview/src/util/errorMessage.ts', 'packages/input-file-preview/src/util/errorMessage.test.ts'],
			rules: {
				'no-template-curly-in-string': 'off',
			},
		},
		{
			files: ['jest.setup.js'],
			rules: {
				'no-empty-function': 'off',
				'no-new': 'off',
				'no-underscore-dangle': 'off',
				'typescript/no-unsafe-assignment': 'off',
				'typescript/no-unsafe-member-access': 'off',
				'typescript/no-unsafe-return': 'off',
				'typescript/prefer-readonly-parameter-types': 'off',
				'import/unambiguous': 'off',
			},
		},
		{
			files: ['playwright.config.js'],
			rules: {
				'no-undef': 'off',
				'typescript/no-unsafe-member-access': 'off',
				'typescript/strict-boolean-expressions': 'off',
			},
		},
	],
});
