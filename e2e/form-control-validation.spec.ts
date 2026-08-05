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

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('input text', () => {
	test('validationMessage', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await expect(alert).toBeHidden();

		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyTextboxMessage(browserName));
	});

	test('patternMismatch', async ({ page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const input = fieldset.getByRole('textbox', { name: 'Telephone number (required)' });
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await input.fill('abc');
		await button.click();

		await expect(alert).toBeVisible();
		await expect(alert).toHaveText('Phone numbers is numbers and hyphens only.');
	});

	test('invalid → valid', async ({ page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Telephone number' });
		const input = fieldset.getByRole('textbox', { name: 'Telephone number (required)' });
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await expect(input).not.toHaveAttribute('aria-invalid');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(input).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();

		await input.fill('123');

		await expect(input).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();

		await button.focus();

		await expect(input).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();
	});
});

test.describe('radiogroup', () => {
	test('invalid → valid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Sex' });
		const radiogroup = fieldset.getByRole('radiogroup');
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await expect(radiogroup).not.toHaveAttribute('aria-invalid');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(radiogroup).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyRadiogroupMessage(browserName));

		await fieldset.getByRole('radio', { name: 'Neither' }).check();

		await expect(radiogroup).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(radiogroup).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();
	});
});

test.describe('select', () => {
	test('invalid → valid → invalid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ has: page.getByRole('combobox') });
		const select = fieldset.getByRole('combobox', { name: 'Age (required)' });
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await expect(select).not.toHaveAttribute('aria-invalid');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(select).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyListboxMessage(browserName));

		await select.selectOption('0–9');

		await expect(select).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(select).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();

		await select.selectOption('');

		await expect(select).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyListboxMessage(browserName));
	});
});

test.describe('textarea', () => {
	test('invalid → valid', async ({ browserName, page }) => {
		const fieldset = page.locator('.fieldset').filter({ hasText: 'Message' });
		const textarea = fieldset.getByRole('textbox', { name: 'Message (required)' });
		const alert = fieldset.getByRole('alert');
		const button = page.getByRole('button', { name: 'Submit' });

		await expect(textarea).not.toHaveAttribute('aria-invalid');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(textarea).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();
		await expect(alert).toHaveText(getEmptyTextboxMessage(browserName));

		await textarea.fill('abc');

		await expect(textarea).toHaveAttribute('aria-invalid', 'true');
		await expect(alert).toBeVisible();

		await button.focus();

		await expect(textarea).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();

		await button.click();

		await expect(textarea).toHaveAttribute('aria-invalid', 'false');
		await expect(alert).toBeHidden();
	});
});
