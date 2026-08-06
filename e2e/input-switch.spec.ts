import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/input-switch/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test('init', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'Explicit label' });
	const switchCtrl = section.locator('x-input-switch');

	await Promise.all([
		expect(switchCtrl).toHaveAttribute('tabindex', '0'),
		expect(switchCtrl).toHaveAttribute('role', 'switch'),
		expect(switchCtrl).toHaveAttribute('aria-checked', 'false'),
		expect(switchCtrl).toHaveAttribute('aria-disabled', 'false'),
		expect(switchCtrl).not.toHaveAttribute('checked'),
	]);
});

test.describe('pattern', () => {
	test('checked attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'checked attribute' }).nth(0);
		const switchCtrl = section.locator('x-input-switch');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		await switchCtrl.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('disabled attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'disabled attribute' });
		const switchCtrl = section.locator('x-input-switch');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);

		// eslint-disable-next-line playwright/no-force-option
		await switchCtrl.click({ force: true });

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('disabled and checked attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'disabled and checked attribute' });
		const switchCtrl = section.locator('x-input-switch');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		// eslint-disable-next-line playwright/no-force-option
		await switchCtrl.click({ force: true });

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);
	});
});

test.describe('event', () => {
	test('control click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Explicit label' });
		const switchCtrl = section.locator('x-input-switch');

		await switchCtrl.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		await switchCtrl.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('Explicit label click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Explicit label' });
		const switchCtrl = section.locator('x-input-switch');
		const label = section.locator('label');

		await label.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		await label.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('Implicit label click', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Implicit label' });
		const switchCtrl = section.locator('x-input-switch');
		const label = section.locator('label');

		await label.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		await label.click();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('Space', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Explicit label' });
		const switchCtrl = section.locator('x-input-switch');

		await switchCtrl.press('Space');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl).toHaveAttribute('checked', '')]);

		await switchCtrl.press('Space');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});

	test('Enter', async ({ page }) => {
		/* Enter キーでは変化しないことを確認する */
		const section = page.locator('section').filter({ hasText: 'Explicit label' });
		const switchCtrl = section.locator('x-input-switch');

		await switchCtrl.press('Enter');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);

		await switchCtrl.press('Enter');

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});
});

test.describe('Form submission', () => {
	test('submit', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Form submission' });
		const submitButton = section.getByRole('button', { name: 'Submit' });

		await submitButton.click();

		await expect(page).toHaveURL('http://localhost:8080/input-switch/demo/?switch2=1');
	});

	test('reset', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Form submission' });
		const switchCtrl = section.locator('x-input-switch');
		const resetButton = section.getByRole('button', { name: 'Reset' });

		const switchCtrl1 = switchCtrl.nth(0);

		await switchCtrl1.click();

		await Promise.all([expect(switchCtrl1).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl1).toHaveAttribute('checked', '')]);

		await resetButton.click();

		await Promise.all([expect(switchCtrl1).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl1).not.toHaveAttribute('checked')]);
	});
});

test.describe('storage', () => {
	test('set', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'storage-key attribute' });
		const switchCtrl = section.locator('x-input-switch');

		expect(await page.evaluate(() => localStorage.getItem('switch6'))).toBeNull();

		await switchCtrl.click();

		expect(await page.evaluate(() => localStorage.getItem('switch6'))).toBe('true');

		await page.reload();

		const section2 = page.locator('section').filter({ hasText: 'storage-key attribute' });
		const switchCtrl2 = section2.locator('x-input-switch');

		await Promise.all([expect(switchCtrl2).toHaveAttribute('aria-checked', 'true'), expect(switchCtrl2).toHaveAttribute('checked', '')]);

		await switchCtrl2.click();

		expect(await page.evaluate(() => localStorage.getItem('switch6'))).toBe('false');
	});

	test('cookie disabled', async ({ browser }) => {
		const context = await browser.newContext();
		await context.addInitScript(() => {
			Object.defineProperty(window, 'localStorage', {
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

		await page.goto('/input-switch/demo/');

		expect(consoleMessages).toContain('Storage access blocked.');

		const section = page.locator('section').filter({ hasText: 'storage-key attribute' });
		const switchCtrl = section.locator('x-input-switch').nth(0);

		await switchCtrl.click();
		await page.reload();

		await Promise.all([expect(switchCtrl).toHaveAttribute('aria-checked', 'false'), expect(switchCtrl).not.toHaveAttribute('checked')]);
	});
});
