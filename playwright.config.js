// @ts-check

import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	/* Basic Configuration */
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	projects: [
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	reporter: 'list', // https://playwright.dev/docs/test-reporters
	testDir: './e2e',
	use: {
		baseURL: 'http://localhost:8080',
	},
	webServer: {
		command: 'npx http-server packages -p 8080',
		url: 'http://localhost:8080',
		reuseExistingServer: !process.env.CI,
	},

	/* Advanced Configuration */
	outputDir: '.playwright/test-results',
	timeout: 60_000,

	/* FullConfig */
	maxFailures: process.env.CI ? 1 : 0,

	/* Expect Options */
	expect: {
		timeout: 10_000,
	},
});
