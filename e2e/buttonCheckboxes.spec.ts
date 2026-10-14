import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/button-checkboxes/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('aria-controls', () => {
	test('auto set', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Specified by group ID' });

		const checkButton = section.getByRole('button', { name: 'Check all' }).first();
		const uncheckButton = section.getByRole('button', { name: 'Uncheck all' }).first();

		const [checkbox1Handle, checkbox2Handle, checkbox3Handle] = await Promise.all([
			section.getByRole('checkbox', { name: '1' }).elementHandle(),
			section.getByRole('checkbox', { name: '2' }).elementHandle(),
			section.getByRole('checkbox', { name: '3' }).elementHandle(),
		]);

		expect(
			await checkButton.evaluate(
				(button, [checkbox1, checkbox2, checkbox3]) => {
					const els = button.ariaControlsElements;
					return els?.length === 3 && els[0] === checkbox1 && els[1] === checkbox2 && els[2] === checkbox3;
				},
				[checkbox1Handle, checkbox2Handle, checkbox3Handle],
			),
		).toBeTruthy();

		expect(
			await uncheckButton.evaluate(
				(button, [checkbox1, checkbox2, checkbox3]) => {
					const els = button.ariaControlsElements;
					return els?.length === 3 && els[0] === checkbox1 && els[1] === checkbox2 && els[2] === checkbox3;
				},
				[checkbox1Handle, checkbox2Handle, checkbox3Handle],
			),
		).toBeTruthy();
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
