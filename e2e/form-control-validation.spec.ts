import { expect, test } from '@playwright/test';

const getEmptyTextboxMessage = (browserName: string): string => {
	switch (browserName) {
		case 'firefox': {
			return 'Please fill out this field.';
		}
		case 'webkit': {
			return 'Fill out this field';
		}
		case 'chromium': {
			return 'Please fill out this field.';
		}
		default:
			return '';
	}
};

const getEmptyRadiogroupMessage = (browserName: string): string => {
	switch (browserName) {
		case 'firefox': {
			return 'Please select one of these options.';
		}
		case 'webkit': {
			return 'Select one of these options';
		}
		case 'chromium': {
			return 'Please select one of these options.';
		}
		default:
			return '';
	}
};

const getEmptyListboxMessage = (browserName: string): string => {
	switch (browserName) {
		case 'firefox': {
			return 'Please select an item in the list.';
		}
		case 'webkit': {
			return 'Select an item in the list';
		}
		case 'chromium': {
			return 'Please select an item in the list.';
		}
		default:
			return '';
	}
};

test.beforeEach(async ({ page }) => {
	await page.goto('/form-control-validation/demo/');
});

test.describe('input text', () => {
	test('validationMessage', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyTextboxMessage(browserName));
	});

	test('patternMismatch', async ({ page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const input = fieldset.getByRole('textbox', { name: 'Telephone number (required)' }).first();
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await input.fill('abc');
		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText('Phone numbers is numbers and hyphens only.');
	});

	test('invalid → valid', async ({ page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const input = fieldset.getByRole('textbox', { name: 'Telephone number (required)' }).first();
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await button.click();

		await expect(alert).toBeVisible();

		await input.fill('123');

		await expect(alert).toBeVisible();

		await button.focus();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeHidden();
	});
});

test.describe('radiogroup', () => {
	test('invalid → valid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Sex' });
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyRadiogroupMessage(browserName));

		await fieldset.getByRole('radio', { name: 'Neither' }).check();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeHidden();
	});
});

test.describe('select', () => {
	test('invalid → valid → invalid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ has: page.getByRole('combobox') });
		const select = fieldset.getByRole('combobox', { name: 'Age (required)' }).first();
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyListboxMessage(browserName));

		await select.selectOption('0–9');

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeHidden();

		await select.selectOption('');

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyListboxMessage(browserName));
	});
});

test.describe('textarea', () => {
	test('invalid → valid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Message' });
		const input = fieldset.getByRole('textbox', { name: 'Message (required)' }).first();
		const alert = fieldset.getByRole('alert').first();
		const button = page.getByRole('button', { name: 'Submit' }).first();

		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyTextboxMessage(browserName));

		await input.fill('abc');

		await expect(alert).toBeVisible();

		await button.focus();

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeHidden();
	});
});
