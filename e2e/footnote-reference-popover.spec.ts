import { expect, test } from '@playwright/test';

const sleep = (ms: number): Promise<void> =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

test.beforeEach(async ({ page }) => {
	await page.goto('/footnote-reference-popover/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('show & hide', () => {
	test('click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		expect(await popover.count()).toBe(0);

		await trigger.focus();

		expect(await popover.count()).toBe(0);

		await trigger.click();

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeVisible();
	});

	test('mouseenter → mouseleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		expect(await popover.count()).toBe(0);

		await trigger.hover();

		expect(await popover.count()).toBe(0);

		await sleep(250);

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('mouseenter → mouseleave (delay)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'All attributes & Style customization' });
		const trigger = section.getByRole('button', { name: '[2]' }).first();
		const popover = page.locator('x-popover').nth(0);

		expect(await popover.count()).toBe(0);

		await trigger.hover();

		expect(await popover.count()).toBe(0);

		await sleep(250);

		expect(await popover.count()).toBe(0);

		await sleep(1000 - 250);

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeVisible();

		await sleep(1000 - 250);

		await expect(popover).toBeHidden();
	});

	test('mouseleave → popover mouseenter → popover mouseleave', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();
		await trigger.hover();
		await sleep(125);
		await popover.hover(); // トリガー要素からカーソルを離してすぐにポップオーバーへ移動する
		await sleep(250);

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeVisible();

		await section.hover();

		await expect(popover).toBeVisible();

		await sleep(250);

		await expect(popover).toBeHidden();
	});

	test('hide button', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();
		await popover.getByRole('button', { name: 'Close' }).first().click();

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeHidden();
	});

	test('Esc', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();

		await page.keyboard.press('1');

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeVisible();

		await page.keyboard.press('Escape');

		expect(await popover.count()).toBe(1);
		await expect(popover).toBeHidden();
	});
});

test.describe('position', () => {
	test('left base', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();

		const triggerBox = (await trigger.boundingBox())!;
		const popoverBox = (await popover.boundingBox())!;
		expect(popoverBox.x).toBe(triggerBox.x);
		expect(popoverBox.y).toBe(Math.round(triggerBox.y) + triggerBox.height);
	});

	test('right base', async ({ page }) => {
		await page.setViewportSize({ width: 200, height: 200 });

		const section = page.locator('section').filter({ hasText: 'Required attributes only' });
		const trigger = section.getByRole('button', { name: '[1]' }).first();
		const popover = page.locator('x-popover').nth(0);

		await trigger.click();

		const triggerBox = (await trigger.boundingBox())!;
		const popoverBox = (await popover.boundingBox())!;
		expect(popoverBox.x).toBe(200 - popoverBox.width);
		expect(popoverBox.y).toBe(Math.round(triggerBox.y) + triggerBox.height);
	});
});
