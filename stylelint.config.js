// @ts-check

/** @type {import('stylelint').Config} */
export default {
	extends: ['@w0s/stylelint-config'],
	rules: {
		'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^-([a-z][a-z0-9]*)(-[a-z0-9]+)*$',
	},
	overrides: [
		{
			files: ['packages/*/demo/**/*.html'],
			customSyntax: 'postcss-html',
		},
	],
};
