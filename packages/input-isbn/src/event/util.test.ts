import { describe, expect, test } from '@jest/globals';
import ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';
import { validate } from './util.ts';

describe('validate', () => {
	const VALIDATION_MESSAGE_ISBN_CHECKDIGIT = 'ISBN check digit message';
	const TEMP_MESSAGE = 'temp message';

	test('empty', () => {
		const $input = document.createElement('input');

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		$input.setCustomValidity(TEMP_MESSAGE);
		expect($input.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate($input, { validationMessageIsbnCheckdigit });

		expect(result).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});

	test('valid date', () => {
		const $input = document.createElement('input');
		$input.value = '978-4-06-519981-7';

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		$input.setCustomValidity(TEMP_MESSAGE);
		expect($input.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate($input, { validationMessageIsbnCheckdigit });

		expect(result).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});

	test('invalid check digit', () => {
		const $input = document.createElement('input');
		$input.value = '978-4-06-519981-0';

		const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

		expect($input.validationMessage).toBe('');

		const result = validate($input, { validationMessageIsbnCheckdigit });

		expect(result).toBeFalsy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});
});
