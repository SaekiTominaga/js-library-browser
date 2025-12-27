import { describe, expect, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import changeEvent from './change.ts';

describe('change event', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';

	const inputElement = document.createElement('input');
	inputElement.pattern = '([0-9]{8})|([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
	const validationMessageMin = new ValidationMessageMin('', inputElement);
	const validationMessageMax = new ValidationMessageMax('', inputElement);

	test('invalid data (no exist)', () => {
		inputElement.value = '2000-02-31';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect(inputElement.validity.customError).toBeTruthy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('change invalid format', () => {
		inputElement.value = 'bar';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect(inputElement.validity.customError).toBeFalsy();
		expect(inputElement.validity.patternMismatch).toBeTruthy();
		expect(inputElement.validationMessage).not.toBe('');
		expect(inputElement.validationMessage).not.toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('change valid pattern', () => {
		inputElement.value = '2000-01-01';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect(inputElement.validity.valid).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});
});
