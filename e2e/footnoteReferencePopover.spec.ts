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
	test('anchor element attributes', async ({ page }) => {
		const anchor = page.getByRole('button', { name: '[1]' });

		await Promise.all([expect(anchor).toHaveAttribute('role', 'button'), expect(anchor).toHaveAttribute('aria-expanded', 'false')]);
	});

	test('popover element no aria-label', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await expect(popover).not.toHaveAttribute('aria-label');
	});

	test('popover element aria-label', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'All attributes, elements & Style customization' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await expect(popover).toHaveAttribute('aria-label', 'Footnote content');
	});

	test('popover element data-*', async ({ page }) => {
		const popover = page.locator('fn-ref [popover]').nth(0);

		await Promise.all([
			expect(popover).toHaveAttribute('data-anchor-width', /[0-9]+(\.[0-9]{1,3})?/u),
			expect(popover).toHaveAttribute('data-anchor-height', /[0-9]+(\.[0-9]{1,3})?/u),
		]);
	});
});

test.describe('show & hide', () => {
	test('click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);

		await anchor.focus();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);

		await anchor.click();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);
	});

	test('pointerenter → pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);

		await anchor.hover();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);

		await sleep(100);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await section.hover();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await sleep(500);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);
	});

	test('pointerenter → pointerleave (delay)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'All attributes, elements & Style customization' });
		const anchor = section.getByRole('button', { name: '[note2]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.hover();
		await sleep(100);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);

		await sleep(200 - 100);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await section.hover();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await sleep(500);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await sleep(1000 - 500);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);
	});

	test('pointerleave → popover pointerenter → popover pointerleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();
		await anchor.hover();
		await sleep(50);
		await popover.hover(); // アンカー要素からカーソルを離してすぐにポップオーバーへ移動する
		await sleep(100);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await section.hover();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await sleep(500);

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);
	});

	test('hide button', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();
		await popover.getByRole('button', { name: 'Close' }).click();

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);
	});

	test('Esc', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes, elements only' });
		const anchor = section.getByRole('button', { name: '[1]' });
		const popover = section.locator('fn-ref [popover]').nth(0);

		await anchor.click();

		await page.keyboard.press('1');

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'true'), expect(popover).toBeVisible()]);

		await page.keyboard.press('Escape');

		await Promise.all([expect(anchor).toHaveAttribute('aria-expanded', 'false'), expect(popover).toBeHidden()]);
	});
});
