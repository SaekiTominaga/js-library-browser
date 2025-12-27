import { describe, expect, test } from '@jest/globals';
import ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';
import changeEvent from './change.ts';

describe('change event', () => {
	const VALIDATION_MESSAGE_ISBN_CHECKDIGIT = 'ISBN check digit message';

	const inputElement = document.createElement('input');
	inputElement.pattern = '(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]';

	const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

	test('invalid check digit', () => {
		inputElement.value = '978-4-06-519981-0';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect(inputElement.validity.customError).toBeTruthy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});

	test('change invalid pattern', () => {
		inputElement.value = 'xxx';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect(inputElement.validity.customError).toBeFalsy();
		expect(inputElement.validity.patternMismatch).toBeTruthy();
		expect(inputElement.validationMessage).not.toBe('');
		expect(inputElement.validationMessage).not.toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});

	test('change valid pattern', () => {
		inputElement.value = '978-4-06-519981-7';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect(inputElement.validity.valid).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});
});
