import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/tab/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('init', () => {
	test('Minimal attributes (no attribute)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);

		await Promise.all([
			expect(tab1).not.toHaveAttribute('href'),
			expect(tab1).toHaveAttribute('id', /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v),
			expect(tab1).toHaveAttribute('role', 'tab'),
			expect(tab1).toHaveAttribute('aria-controls', 'tabpanel1-1'),

			expect(tab1).toHaveAttribute('tabindex', '0'),
			expect(tab1).toHaveAttribute('aria-selected', 'true'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).toHaveAttribute('role', 'tabpanel'),
			expect(tabpanel1).toHaveAttribute('aria-labelledby', /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v),

			expect(tabpanel1).not.toHaveAttribute('class'),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
		]);
	});

	test('tablist-label attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'tablist-label attribute' });

		await expect(section.getByRole('tablist')).toHaveAttribute('aria-label', 'Tab label');
	});
});

test.describe('tab event', () => {
	test('click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tab3 = tabs.nth(2);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);
		const tabpanel3 = tabpanels.nth(2);

		await tab2.click();

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '-1'),
			expect(tab1).toHaveAttribute('aria-selected', 'false'),
			expect(tab2).toHaveAttribute('tabindex', '0'),
			expect(tab2).toHaveAttribute('aria-selected', 'true'),
			expect(tab3).toHaveAttribute('tabindex', '-1'),
			expect(tab3).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel2).toHaveAttribute('class', ''),
			expect(tabpanel3).toHaveAttribute('class', 'is-hidden'),
		]);
	});

	test('←↑→↓', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tab3 = tabs.nth(2);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);
		const tabpanel3 = tabpanels.nth(2);

		await tab1.focus();
		await page.keyboard.press('ArrowLeft');

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '-1'),
			expect(tab1).toHaveAttribute('aria-selected', 'false'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),
			expect(tab3).toHaveAttribute('tabindex', '0'),
			expect(tab3).toHaveAttribute('aria-selected', 'true'),

			expect(tabpanel1).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel3).toHaveAttribute('class', ''),
		]);

		await page.keyboard.press('ArrowDown');

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '0'),
			expect(tab1).toHaveAttribute('aria-selected', 'true'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),
			expect(tab3).toHaveAttribute('tabindex', '-1'),
			expect(tab3).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).toHaveAttribute('class', ''),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel3).toHaveAttribute('class', 'is-hidden'),
		]);
	});

	test('Home / End', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tab3 = tabs.nth(2);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);
		const tabpanel3 = tabpanels.nth(2);

		await tab1.focus();
		await page.keyboard.press('End');

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '-1'),
			expect(tab1).toHaveAttribute('aria-selected', 'false'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),
			expect(tab3).toHaveAttribute('tabindex', '0'),
			expect(tab3).toHaveAttribute('aria-selected', 'true'),

			expect(tabpanel1).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel3).toHaveAttribute('class', ''),
		]);

		await page.keyboard.press('Home');

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '0'),
			expect(tab1).toHaveAttribute('aria-selected', 'true'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),
			expect(tab3).toHaveAttribute('tabindex', '-1'),
			expect(tab3).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).toHaveAttribute('class', ''),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel3).toHaveAttribute('class', 'is-hidden'),
		]);
	});
});

test.describe('tabpanel event', () => {
	test('Ctrl + ←', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tabpanel1 = tabpanels.nth(0);

		await tabpanel1.locator('button').focus();
		await tabpanel1.press('Control+ArrowLeft');

		await expect(tab1).toBeFocused();
	});

	test('Ctrl + ↑', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'no attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab2 = tabs.nth(1);
		const tabpanel2 = tabpanels.nth(1);

		await tab2.click();
		await tabpanel2.locator('button').focus();
		await tabpanel2.press('Control+ArrowUp');

		await expect(tab2).toBeFocused();
	});
});

test.describe('storage', () => {
	test('set', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'storage-key attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tab3 = tabs.nth(2);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);
		const tabpanel3 = tabpanels.nth(2);

		expect(await page.evaluate(() => sessionStorage.getItem('tab3'))).toBeNull();

		await tab2.click();

		expect(await page.evaluate(() => sessionStorage.getItem('tab3'))).toBe('tabpanel3-2');

		await page.reload();

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '-1'),
			expect(tab1).toHaveAttribute('aria-selected', 'false'),
			expect(tab2).toHaveAttribute('tabindex', '0'),
			expect(tab2).toHaveAttribute('aria-selected', 'true'),
			expect(tab3).toHaveAttribute('tabindex', '-1'),
			expect(tab3).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel2).not.toHaveAttribute('class'),
			expect(tabpanel3).toHaveAttribute('class', 'is-hidden'),
		]);
	});

	test('cookie disabled', async ({ browser }) => {
		const context = await browser.newContext();
		await context.addInitScript(() => {
			Object.defineProperty(globalThis, 'sessionStorage', {
				get: () => {
					throw new DOMException('The operation is insecure.', 'SecurityError');
				},
			});
		});
		const page = await context.newPage();

		const consoleMessages: string[] = [];
		page.on('console', (msg) => {
			consoleMessages.push(msg.text());
		});

		await page.goto('/tab/demo/');

		expect(consoleMessages).toContain('Storage access blocked.');

		const section = page.locator('section').filter({ hasText: 'storage-key attribute' });
		const tabs = section.locator('[slot="tab"]');
		const tabpanels = section.locator('[slot="tabpanel"]');

		const tab1 = tabs.nth(0);
		const tab2 = tabs.nth(1);
		const tab3 = tabs.nth(2);
		const tabpanel1 = tabpanels.nth(0);
		const tabpanel2 = tabpanels.nth(1);
		const tabpanel3 = tabpanels.nth(2);

		await tab2.click();
		await page.reload();

		await Promise.all([
			expect(tab1).toHaveAttribute('tabindex', '0'),
			expect(tab1).toHaveAttribute('aria-selected', 'true'),
			expect(tab2).toHaveAttribute('tabindex', '-1'),
			expect(tab2).toHaveAttribute('aria-selected', 'false'),
			expect(tab3).toHaveAttribute('tabindex', '-1'),
			expect(tab3).toHaveAttribute('aria-selected', 'false'),

			expect(tabpanel1).not.toHaveAttribute('class'),
			expect(tabpanel2).toHaveAttribute('class', 'is-hidden'),
			expect(tabpanel3).toHaveAttribute('class', 'is-hidden'),
		]);
	});
});
