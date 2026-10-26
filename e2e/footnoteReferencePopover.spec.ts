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
	test('anchor element role', async ({ page }) => {
		await expect(page.getByRole('button', { name: '[1]' })).toHaveAttribute('role', 'button');
	});
});

test.describe('show & hide', () => {
	test('click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await expect(popover).toBeHidden();

		await anchor.focus();

		await expect(popover).toBeHidden();

		await anchor.click();

		await expect(popover).toBeVisible();
	});

	test('pointerenter → pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await expect(popover).toBeHidden();

		await anchor.hover();

		await expect(popover).toBeHidden();

		await sleep(250);

		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('pointerenter → pointerleave (delay)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'All attributes, elements & Style customization' });
		const anchor = section.getByRole('button', { name: '[note2]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.hover();
		await sleep(250);

		await expect(popover).toBeHidden();

		await sleep(500 - 250);

		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeVisible();

		await sleep(1000 - 250);

		await expect(popover).toBeHidden();
	});

	test('pointerleave → popover pointerenter → popover pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();
		await anchor.hover();
		await sleep(125);
		await popover.hover(); // トリガー要素からカーソルを離してすぐにポップオーバーへ移動する
		await sleep(250);

		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('hide button', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();
		await popover.getByRole('button', { name: 'Close' }).click();

		await expect(popover).toBeHidden();
	});

	test('Esc', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();

		await page.keyboard.press('1');

		await expect(popover).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(popover).toBeHidden();
	});
});
