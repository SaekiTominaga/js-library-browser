import { expect, test } from '@playwright/test';

const sleep = (ms: number): Promise<void> =>
	// oxlint-disable-next-line promise/avoid-new
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

test.beforeEach(async ({ page }) => {
	await page.goto('/footnote-reference-popover/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('init', () => {
	test('trriger role', async ({ page }) => {
		await expect(page.getByRole('button', { name: '[1]' })).toHaveAttribute('role', 'button');
	});

	test('popover attributes', async ({ page }) => {
		await page.getByRole('button', { name: '[2]' }).click();

		const popover = page.locator('x-popover');

		await expect(popover).toHaveAttribute('popover', '');
		await expect(popover).toHaveAttribute('class', 'my-popover');
		await expect(popover).toHaveAttribute('aria-label', 'Note');
	});
});

test.describe('show & hide', () => {
	test('click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' });
		const popover = page.locator('x-popover').nth(0);

		await expect(popover).toHaveCount(0);

		await trigger.focus();

		await expect(popover).toHaveCount(0);

		await trigger.click();

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeVisible();
	});

	test('pointerenter → pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' });
		const popover = page.locator('x-popover').nth(0);

		await expect(popover).toHaveCount(0);

		await trigger.hover();

		await expect(popover).toHaveCount(0);

		await sleep(250);

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('pointerenter → pointerleave (delay)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'All attributes & Style customization' });
		const trigger = section.getByRole('button', { name: '[2]' });
		const popover = page.locator('x-popover').nth(0);

		await expect(popover).toHaveCount(0);

		await trigger.hover();

		await expect(popover).toHaveCount(0);

		await sleep(250);

		await expect(popover).toHaveCount(0);

		await sleep(1000 - 250);

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeVisible();

		await sleep(1000 - 250);

		await expect(popover).toBeHidden();
	});

	test('pointerleave → popover pointerenter → popover pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' });
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();
		await trigger.hover();
		await sleep(125);
		await popover.hover(); // トリガー要素からカーソルを離してすぐにポップオーバーへ移動する
		await sleep(250);

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('hide button', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' });
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();
		await popover.getByRole('button', { name: 'Close' }).click();

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeHidden();
	});

	test('Esc', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' });
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();

		await page.keyboard.press('1');

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(popover).toHaveCount(1);
		await expect(popover).toBeHidden();
	});
});
