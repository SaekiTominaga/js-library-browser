import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/button-checkboxes/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('aria-controls', () => {
	test('UUID auto set', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by group ID' });

		await Promise.all([
			expect(section.getByRole('button', { name: 'Check all' }).first()).toHaveAttribute(
				'aria-controls',
				/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12} [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12} [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v,
			),
			expect(section.getByRole('button', { name: 'Uncheck all' }).first()).toHaveAttribute(
				'aria-controls',
				/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12} [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12} [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v,
			),

			expect(section.getByRole('checkbox', { name: '1' })).toHaveAttribute('id', /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v),
			expect(section.getByRole('checkbox', { name: '2' })).toHaveAttribute('id', /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v),
			expect(section.getByRole('checkbox', { name: '3' })).toHaveAttribute('id', /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v),
		]);
	});

	test('already aria-controls set', async ({ page }) => {
		await page.goto('/button-checkboxes/demo/e2e.html');

		const section = page.locator('section').filter({ hasText: 'aria-controls attribute' });

		await Promise.all([
			expect(section.getByRole('button', { name: 'Check all' }).first()).toHaveAttribute('aria-controls', 'checkbox4-1'),

			expect(section.getByRole('checkbox', { name: '1' })).toHaveAttribute('id', 'checkbox4-1'),
		]);
	});

	test('already checkbox id set', async ({ page }) => {
		await page.goto('/button-checkboxes/demo/e2e.html');

		const section = page.locator('section').filter({ hasText: 'checkbox id attribute' });

		await Promise.all([
			expect(section.getByRole('button', { name: 'Check all' }).first()).toHaveAttribute('aria-controls', 'checkbox5-1'),

			expect(section.getByRole('checkbox', { name: '1' })).toHaveAttribute('id', 'checkbox5-1'),
		]);
	});
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
