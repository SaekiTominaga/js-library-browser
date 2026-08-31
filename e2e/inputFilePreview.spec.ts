import path from 'node:path';
import { expect, test } from '@playwright/test';

const demoDir = `${import.meta.dirname}/../packages/input-file-preview/demo`;

test.beforeEach(async ({ page }) => {
	await page.goto('/input-file-preview/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('file type', () => {
	test('image', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.locator('input[type="file"]');
		const output = section.locator('output[for="input-file1"]');

		await expect(output).toBeHidden();

		await input.setInputFiles(path.resolve(demoDir, 'sample.png'));

		await Promise.all([
			expect(output).toBeVisible(),
			expect(output).toHaveText(''),
			expect(output.locator('img')).toHaveAttribute('alt', 'sample.png'),
			expect(output.locator('img')).toHaveCount(1),
			expect(output.locator('audio')).toHaveCount(0),
			expect(output.locator('video')).toHaveCount(0),
		]);
	});

	test('audio', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.locator('input[type="file"]');
		const output = section.locator('output[for="input-file1"]');

		await expect(output).toBeHidden();

		await input.setInputFiles(path.resolve(demoDir, 'sample.mp3'));

		await Promise.all([
			expect(output).toBeVisible(),
			expect(output).toHaveText('sample.mp3'),
			expect(output.locator('audio')).toHaveText('sample.mp3'),
			expect(output.locator('img')).toHaveCount(0),
			expect(output.locator('audio')).toHaveCount(1),
			expect(output.locator('video')).toHaveCount(0),
		]);
	});

	test('video', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.locator('input[type="file"]');
		const output = section.locator('output[for="input-file1"]');

		await expect(output).toBeHidden();

		await input.setInputFiles(path.resolve(demoDir, 'sample.webm'));

		await Promise.all([
			expect(output).toBeVisible(),
			expect(output).toHaveText('sample.webm'),
			expect(output.locator('video')).toHaveText('sample.webm'),
			expect(output.locator('img')).toHaveCount(0),
			expect(output.locator('audio')).toHaveCount(0),
			expect(output.locator('video')).toHaveCount(1),
		]);
	});

	test('text', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.locator('input[type="file"]');
		const output = section.locator('output[for="input-file1"]');

		await expect(output).toBeHidden();

		await input.setInputFiles(path.resolve(demoDir, 'sample.txt'));

		await Promise.all([
			expect(output).toBeVisible(),
			expect(output).toHaveText('sample.txt (20 byte) cannot be previewed.'),
			expect(output.locator('img')).toHaveCount(0),
			expect(output.locator('audio')).toHaveCount(0),
			expect(output.locator('video')).toHaveCount(0),
		]);
	});
});

test('multiple', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'multiple attribute' });
	const input = section.locator('input[type="file"]');
	const output = section.locator('output[for="input-file2"]');

	await input.setInputFiles([path.resolve(demoDir, 'sample.mp3'), path.resolve(demoDir, 'sample.png')]);

	await Promise.all([
		expect(output.nth(0)).toBeVisible(),
		expect(output.nth(1)).toBeVisible(),
		expect(output).toHaveCount(2),
		expect(output.nth(0).locator('audio')).toHaveCount(1),
		expect(output.nth(1).locator('img')).toHaveCount(1),
	]);
});

test('oversize', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'data-max-size attribute' });
	const input = section.locator('input[type="file"]');
	const output = section.locator('output[for="input-file3"]');

	await input.setInputFiles(path.resolve(demoDir, 'sample.webm'));

	await expect(output).toHaveText('sample.webm (901185 byte) cannot be previewed.');
});
