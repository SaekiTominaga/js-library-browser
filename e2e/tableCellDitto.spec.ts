import { expect, test } from '@playwright/test';

const getTextWidth = ($element: HTMLElement): number => {
	const range = document.createRange();
	range.selectNodeContents($element);

	const rect = range.getBoundingClientRect();
	return rect.width;
};

test.beforeEach(async ({ page }) => {
	await page.goto('/table-cell-ditto/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('convert', () => {
	test('no style attribute', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(1).getByRole('rowheader').nth(0);

		await Promise.all([
			expect(targetCell).toHaveText('"'),
			expect(targetCell).toHaveAttribute('title', 'header cell'),
			expect(targetCell).not.toHaveAttribute('style'),
		]);

		await switchButton.click();

		await Promise.all([
			expect(targetCell).toHaveText('header cell'),
			expect(targetCell).not.toHaveAttribute('title'),
			expect(targetCell).not.toHaveAttribute('style'),
		]);
	});

	test('style attribute', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(2).getByRole('cell').nth(0);

		await Promise.all([
			expect(targetCell).toHaveText('"'),
			expect(targetCell).toHaveAttribute('title', 'data cell 1'),
			expect(targetCell).toHaveAttribute('style'),
		]);

		await switchButton.click();

		await Promise.all([
			expect(targetCell).toHaveText('data cell 1'),
			expect(targetCell).not.toHaveAttribute('title'),
			expect(targetCell).toHaveAttribute('style', ''),
		]);
	});
});

test.describe('text-align', () => {
	test('left', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(2).getByRole('cell').nth(0);
		const aboveCell = tbody.nth(0).getByRole('row').nth(1).getByRole('cell').nth(0);

		const cellTextWidth = await aboveCell.evaluate(getTextWidth);
		const dittoMarkWidth = await targetCell.evaluate(getTextWidth);
		const cellPadding = Number(await aboveCell.evaluate(($element): string => getComputedStyle($element).paddingInlineStart.replace(/px$/v, '')));
		const padding = (cellTextWidth - dittoMarkWidth) / 2 + cellPadding;

		await Promise.all([
			expect(targetCell).toHaveText('"'),
			expect(targetCell).toHaveAttribute('style', `padding-inline-start: ${String(Number(padding.toFixed(2)))}px;`),
		]);
	});

	test('center', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(1).getByRole('rowheader').nth(0);

		await Promise.all([expect(targetCell).toHaveText('"'), expect(targetCell).not.toHaveAttribute('style')]);
	});

	test('right', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(1).getByRole('row').nth(3).getByRole('cell').nth(1);
		const aboveCell = tbody.nth(1).getByRole('row').nth(1).getByRole('cell').nth(1);

		const cellTextWidth = await aboveCell.evaluate(getTextWidth);
		const dittoMarkWidth = await targetCell.evaluate(getTextWidth);
		const cellPadding = Number(await aboveCell.evaluate(($element): string => getComputedStyle($element).paddingInlineEnd.replace(/px$/v, '')));
		const padding = (cellTextWidth - dittoMarkWidth) / 2 + cellPadding;

		await Promise.all([
			expect(targetCell).toHaveText('"'),
			expect(targetCell).toHaveAttribute('style', `text-align: end; padding-inline-end: ${String(Number(padding.toFixed(2)))}px;`),
		]);
	});
});
