import { type Dialog, expect, test } from '@playwright/test';

test.beforeEach(async ({ browserName, page }) => {
	test.skip(['webkit'].includes(browserName), 'Exclude browsers that do not support `beforeunload` event');

	await page.goto('/form-before-unload-confirm/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test('submit', async ({ page }) => {
	let calledDialog: Dialog | undefined;

	page.on('dialog', async (dialog) => {
		await dialog.accept();
		calledDialog = dialog;
	});

	await page.getByRole('textbox', { name: 'Type anything' }).first().fill('abc');
	await page.getByRole('button', { name: 'Submit' }).first().click();

	expect(calledDialog).toBeUndefined();
});

test.describe('link', () => {
	test('no input', async ({ page }) => {
		let calledDialog: Dialog | undefined;

		page.on('dialog', async (dialog) => {
			await dialog.accept();
			calledDialog = dialog;
		});

		await page.getByRole('link', { name: 'example.com' }).first().click();

		expect(calledDialog).toBeUndefined();
	});

	test('input', async ({ page }) => {
		let calledDialog: Dialog | undefined;

		page.on('dialog', async (dialog) => {
			await dialog.accept();
			calledDialog = dialog;
		});

		await page.getByRole('textbox', { name: 'Type anything' }).first().fill('abc');
		await page.getByRole('link', { name: 'example.com' }).first().click();

		expect(calledDialog?.type()).toBe('beforeunload');
	});
});
