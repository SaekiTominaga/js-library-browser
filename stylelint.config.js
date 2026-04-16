// @ts-check

/** @type {import('stylelint').Config} */
export default {
	extends: ['@w0s/stylelint-config'],
	rules: {
		'selector-no-deprecated': null, // https://github.com/stylelint/stylelint/issues/9221
		'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^-([a-z][a-z0-9]*)(-[a-z0-9]+)*$',

		/**
		 * [plugin] stylelint-root-colors
		 */
		'plugin/root-colors': true,
	},
	overrides: [
		{
			files: ['packages/*/demo/**/*.html'],
			customSyntax: 'postcss-html',
		},
	],
};
