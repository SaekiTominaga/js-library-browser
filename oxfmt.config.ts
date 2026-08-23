import { defineConfig } from 'oxfmt';

export default defineConfig({
	singleQuote: true,
	sortImports: {
		newlinesBetween: false,
	},
	overrides: [
		{
			files: ['*.css'],
			options: {
				singleQuote: false,
			},
		},
	],
});
