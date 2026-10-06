import { expect, test } from '@playwright/test';

const sleep = (ms: number) =>
	// oxlint-disable-next-line promise/avoid-new
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ browserName, context, page }) => {
	test.skip(['firefox', 'webkit'].includes(browserName), 'Exclude browsers that do not support `clipboard-read` and `clipboard-write`');

	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/button-clipboard/demo/');
});

test.afterEach(async ({ browserName, page }) => {
	test.skip(['firefox', 'webkit'].includes(browserName), 'Exclude browsers that do not support `clipboard-read` and `clipboard-write`');

	await page.evaluate(async () => {
		await navigator.clipboard.writeText('');
	});

	await page.close();
});

test('data-text', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'data-text attribute' });

	expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');

	await section.getByRole('button', { name: 'Copy' }).click();

	expect(await page.evaluate('navigator.clipboard.readText()')).toBe('Text 1');
});

test.describe('data-target', () => {
	test('General element', async ({ page }) => {
		const section = page.locator('section > section').filter({ hasText: 'General element (such as <p> element)' });

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');

		await section.getByRole('button', { name: 'Copy' }).click();

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('Text 2-1');
	});

	test('Form controls', async ({ page }) => {
		const section = page.locator('section > section').filter({ hasText: 'Form controls (such as <textarea> element)' });

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');

		await section.getByRole('button', { name: 'Copy' }).click();

		expect(await page.evaluate('navigator.clipboard.readText()')).toMatch(/^\t{1}Text 2-2\r?\n\t{2}Text 2-2$/v);
	});

	test('<meta> element', async ({ page }) => {
		const section = page.locator('section > section').filter({ hasText: '<meta> element' });

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');

		await section.getByRole('button', { name: 'Copy' }).click();

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('Text 2-3');
	});

	test('<pre> element', async ({ page }) => {
		const section = page.locator('section > section').filter({ hasText: '<pre> element (keep line breaks and spaces)' });

		expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');

		await section.getByRole('button', { name: 'Copy' }).click();

		expect(await page.evaluate('navigator.clipboard.readText()')).toMatch(/^\t{1}Text 2-4\r?\n\t{2}Text 2-4$/v);
	});
});

test('Feedback', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'Feedback' });

	expect(await page.evaluate('navigator.clipboard.readText()')).toBe('');
	await expect(section.getByRole('status')).not.toHaveText('✔ Copied to clipboard!');

	await section.getByRole('button', { name: 'Copy' }).click();

	expect(await page.evaluate('navigator.clipboard.readText()')).toBe('Text 3');
	await expect(section.getByRole('status')).toHaveText('✔ Copied to clipboard!');

	await sleep(100);

	await expect(section.getByRole('status')).not.toHaveText('✔ Copied to clipboard!');
});
