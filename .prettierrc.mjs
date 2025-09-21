/** @type {import("prettier").Config} */
const config = {
	singleQuote: true,

	overrides: [
		{
			files: '*.css',
			options: {
				singleQuote: false,
			},
		},
	],
};
export default config;
