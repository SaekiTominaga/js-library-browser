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

		await expect(targetCell).toHaveText('"');
		await expect(targetCell).toHaveAttribute('title', 'header cell');
		await expect(targetCell).not.toHaveAttribute('style');

		await switchButton.click();

		await expect(targetCell).toHaveText('header cell');
		await expect(targetCell).not.toHaveAttribute('title');
		await expect(targetCell).not.toHaveAttribute('style');
	});

	test('style attribute', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(2).getByRole('cell').nth(0);

		await expect(targetCell).toHaveText('"');
		await expect(targetCell).toHaveAttribute('title', 'data cell 1');
		await expect(targetCell).toHaveAttribute('style');

		await switchButton.click();

		await expect(targetCell).toHaveText('data cell 1');
		await expect(targetCell).not.toHaveAttribute('title');
		await expect(targetCell).toHaveAttribute('style', '');
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
		const cellPadding = Number.parseInt(await aboveCell.evaluate(($element): string => getComputedStyle($element).paddingInlineStart), 10);
		const padding = (cellTextWidth - dittoMarkWidth) / 2 + cellPadding;

		await expect(targetCell).toHaveText('"');
		await expect(targetCell).toHaveAttribute('style', `padding-inline-start: ${padding.toFixed(2)}px;`);
	});

	test('center', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(0).getByRole('row').nth(1).getByRole('rowheader').nth(0);

		await expect(targetCell).toHaveText('"');
		await expect(targetCell).not.toHaveAttribute('style');
	});

	test('right', async ({ page }) => {
		const switchButton = page.getByRole('button', { name: 'Switching' });
		const tbody = page.getByRole('table').locator('tbody');

		await switchButton.click();

		const targetCell = tbody.nth(1).getByRole('row').nth(3).getByRole('cell').nth(1);
		const aboveCell = tbody.nth(1).getByRole('row').nth(1).getByRole('cell').nth(1);

		const cellTextWidth = await aboveCell.evaluate(getTextWidth);
		const dittoMarkWidth = await targetCell.evaluate(getTextWidth);
		const cellPadding = Number.parseInt(await aboveCell.evaluate(($element): string => getComputedStyle($element).paddingInlineEnd), 10);
		const padding = (cellTextWidth - dittoMarkWidth) / 2 + cellPadding;

		await expect(targetCell).toHaveText('"');
		await expect(targetCell).toHaveAttribute('style', `text-align: end; padding-inline-end: ${padding.toFixed(2)}px;`);
	});
});
