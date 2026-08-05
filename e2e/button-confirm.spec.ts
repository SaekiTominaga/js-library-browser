import { type Dialog, expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/button-confirm/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test('data-message', async ({ page }) => {
	const section = page.locator('section').filter({ hasText: 'data-message attribute' });

	let calledDialog: Dialog | undefined;

	page.on('dialog', async (dialog) => {
		await dialog.accept();
		calledDialog = dialog;
	});

	expect(calledDialog).toBeUndefined();

	await section.getByRole('button', { name: 'Submit' }).click();

	expect(calledDialog?.type()).toBe('confirm');
	expect(calledDialog?.message()).toBe('Message text');
});
