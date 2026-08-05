import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/input-date-to-text/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test.describe('init', () => {
	test('Minimal attributes', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.getByRole('textbox');

		await expect(input).toHaveAttribute('type', 'text');
		await expect(input).toHaveAttribute('minlength', '8');
		await expect(input).toHaveAttribute('pattern', '([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})');
		await expect(input).toHaveAttribute('placeholder', 'YYYY-MM-DD');
	});

	test('data-title attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'data-title attribute' });
		const input = section.getByRole('textbox');

		await expect(input).not.toHaveAttribute('data-title');
		await expect(input).toHaveAttribute('title', 'Dates should be consecutive numbers or separated by `-` or `/` in the order of year, month, and day.');
	});

	test('min attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'min, data-validation-min attribute' });
		const input = section.getByRole('textbox');

		await expect(input).not.toHaveAttribute('min');
	});

	test('max attribute', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'max, data-validation-max attribute' });
		const input = section.getByRole('textbox');

		await expect(input).not.toHaveAttribute('max');
	});
});

test.describe('validity', () => {
	test('tooShort', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.getByRole('textbox');

		await input.fill('123');

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				customError: validity.customError,
				patternMismatch: validity.patternMismatch,
				tooShort: validity.tooShort,
				valid: validity.valid,
			};
		});

		expect(validityState.customError).toBeFalsy();
		expect(validityState.patternMismatch).toBeTruthy();
		expect(validityState.tooShort).toBeTruthy();
		expect(validityState.valid).toBeFalsy();
	});

	test('patternMismatch', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.getByRole('textbox');

		await input.fill('abcdefgh');

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				customError: validity.customError,
				patternMismatch: validity.patternMismatch,
				tooShort: validity.tooShort,
				valid: validity.valid,
			};
		});

		expect(validityState.customError).toBeFalsy();
		expect(validityState.patternMismatch).toBeTruthy();
		expect(validityState.tooShort).toBeFalsy();
		expect(validityState.valid).toBeFalsy();
	});

	test('customError (2/30)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'Minimal attributes' });
		const input = section.getByRole('textbox');

		await input.fill('2001-02-30');
		await section.getByRole('button', { name: 'Submit' }).focus();

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				customError: validity.customError,
				patternMismatch: validity.patternMismatch,
				tooShort: validity.tooShort,
				valid: validity.valid,
			};
		});

		expect(validityState.customError).toBeTruthy();
		expect(validityState.patternMismatch).toBeFalsy();
		expect(validityState.tooShort).toBeFalsy();
		expect(validityState.valid).toBeFalsy();

		expect(await input.evaluate(($input: HTMLInputElement): string => $input.validationMessage)).toBe('This date does not exist.');
	});

	test('customError (min)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'min, data-validation-min attribute' });
		const input = section.getByRole('textbox');

		await input.fill('1999-12-31');
		await section.getByRole('button', { name: 'Submit' }).focus();

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				customError: validity.customError,
				patternMismatch: validity.patternMismatch,
				tooShort: validity.tooShort,
				valid: validity.valid,
			};
		});

		expect(validityState.customError).toBeTruthy();
		expect(validityState.patternMismatch).toBeFalsy();
		expect(validityState.tooShort).toBeFalsy();
		expect(validityState.valid).toBeFalsy();

		expect(await input.evaluate(($input: HTMLInputElement): string => $input.validationMessage)).toBe('Please enter a value after A.D.2000.');
	});

	test('customError (max)', async ({ page }) => {
		const section = page.locator('section').filter({ hasText: 'max, data-validation-max attribute' });
		const input = section.getByRole('textbox');

		await input.fill('2021-01-01');
		await section.getByRole('button', { name: 'Submit' }).focus();

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				customError: validity.customError,
				patternMismatch: validity.patternMismatch,
				tooShort: validity.tooShort,
				valid: validity.valid,
			};
		});

		expect(validityState.customError).toBeTruthy();
		expect(validityState.patternMismatch).toBeFalsy();
		expect(validityState.tooShort).toBeFalsy();
		expect(validityState.valid).toBeFalsy();

		expect(await input.evaluate(($input: HTMLInputElement): string => $input.validationMessage)).toBe('Please enter a value before A.D.2020.');
	});
});
