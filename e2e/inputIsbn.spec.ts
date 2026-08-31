import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/input-isbn/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

test('init', async ({ page }) => {
	const input = page.getByRole('textbox');

	await Promise.all([
		expect(input).toHaveAttribute('minlength', '10'),
		expect(input).toHaveAttribute('maxlength', '17'),
		expect(input).toHaveAttribute(
			'pattern',
			'(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]',
		),
	]);
});

test.describe('validity', () => {
	test('tooShort', async ({ page }) => {
		const input = page.getByRole('textbox');

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
		const input = page.getByRole('textbox');

		await input.fill('abcdefghij');

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

	test('customError', async ({ page }) => {
		const input = page.getByRole('textbox');

		await input.fill('978-4-06-519981-0');
		await page.getByRole('button', { name: 'Submit' }).focus();

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

		expect(await input.evaluate(($input: HTMLInputElement): string => $input.validationMessage)).toBe('ISBN check digit is invalid.');
	});

	test('valid', async ({ page }) => {
		const input = page.getByRole('textbox');

		await input.fill('978-4-06-519981-7');
		await page.getByRole('button', { name: 'Submit' }).focus();

		const validityState = await input.evaluate(($input: HTMLInputElement): Partial<ValidityState> => {
			const { validity } = $input;
			return {
				valid: validity.valid,
			};
		});

		expect(validityState.valid).toBeTruthy();
	});
});
