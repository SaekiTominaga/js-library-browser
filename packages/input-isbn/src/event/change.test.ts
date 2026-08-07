import { describe, expect, test } from '@jest/globals';
import ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';
import changeEvent from './change.ts';

describe('change event', () => {
	const VALIDATION_MESSAGE_ISBN_CHECKDIGIT = 'ISBN check digit message';

	const $input = document.createElement('input');
	$input.pattern = '(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]';

	const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

	test('invalid check digit', () => {
		$input.value = '978-4-06-519981-0';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect($input.validity.customError).toBeTruthy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});

	test('change invalid pattern', () => {
		$input.value = 'xxx';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect($input.validity.customError).toBeFalsy();
		expect($input.validity.patternMismatch).toBeTruthy();
		expect($input.validationMessage).not.toBe('');
		expect($input.validationMessage).not.toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	});

	test('change valid pattern', () => {
		$input.value = '978-4-06-519981-7';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			validationMessageIsbnCheckdigit,
		});

		expect($input.validity.valid).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});
});
