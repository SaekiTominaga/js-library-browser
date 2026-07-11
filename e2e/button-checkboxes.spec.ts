import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/button-checkboxes/demo/');
});

test.describe('group ID', () => {
	test('load', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by group ID' });

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});

	test('check', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by group ID' });

		await section.getByRole('button', { name: 'Check all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).toBeChecked(),
		]);
	});

	test('uncheck', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by group ID' });

		await section.getByRole('button', { name: 'Uncheck all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});
});

test.describe('class attribute', () => {
	test('load', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by class attribute' });

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});

	test('check', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by class attribute' });

		await section.getByRole('button', { name: 'Check all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).toBeChecked(),
		]);
	});

	test('uncheck', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by class attribute' });

		await section.getByRole('button', { name: 'Uncheck all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});
});

test.describe('name attribute', () => {
	test('load', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by name attribute' });

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});

	test('check', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by name attribute' });

		await section.getByRole('button', { name: 'Check all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).toBeChecked(),
		]);
	});

	test('uncheck', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by name attribute' });

		await section.getByRole('button', { name: 'Uncheck all' }).first().click();

		await Promise.all([
			expect(section.getByRole('checkbox', { name: '1' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '2' })).not.toBeChecked(),
			expect(section.getByRole('checkbox', { name: '3' })).not.toBeChecked(),
		]);
	});
});
