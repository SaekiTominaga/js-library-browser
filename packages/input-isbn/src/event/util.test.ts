import { describe, expect, test } from '@jest/globals';
import ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';
import { validate } from './util.ts';

describe('validate', () => {
	const VALIDATION_MESSAGE_ISBN_CHECKDIGIT = 'ISBN check digit message';
	const TEMP_MESSAGE = 'temp message';

	test('empty', () => {
		const inputElement = document.createElement('input');

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		inputElement.setCustomValidity(TEMP_MESSAGE);
		expect(inputElement.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate(inputElement, { validationMessageIsbnCheckdigit });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});

	test('valid date', () => {
		const inputElement = document.createElement('input');
		inputElement.value = '978-4-06-519981-7';

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		inputElement.setCustomValidity(TEMP_MESSAGE);
		expect(inputElement.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate(inputElement, { validationMessageIsbnCheckdigit });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});

	test('invalid check digit', () => {
		const inputElement = document.createElement('input');
		inputElement.value = '978-4-06-519981-0';

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		expect(inputElement.validationMessage).toBe('');

		const result = validate(inputElement, { validationMessageIsbnCheckdigit });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});
});
