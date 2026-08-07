import { describe, expect, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import changeEvent from './change.ts';

describe('change event', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';

	const $input = document.createElement('input');
	$input.pattern = '([0-9]{8})|([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
	const validationMessageMin = new ValidationMessageMin('', $input);
	const validationMessageMax = new ValidationMessageMax('', $input);

	test('invalid data (no exist)', () => {
		$input.value = '2000-02-31';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect($input.validity.customError).toBeTruthy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('change invalid format', () => {
		$input.value = 'bar';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect($input.validity.customError).toBeFalsy();
		expect($input.validity.patternMismatch).toBeTruthy();
		expect($input.validationMessage).not.toBe('');
		expect($input.validationMessage).not.toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('change valid pattern', () => {
		$input.value = '2000-01-01';

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

		changeEvent(event, {
			min,
			max,
			validationMessageNoExist,
			validationMessageMin,
			validationMessageMax,
		});

		expect($input.validity.valid).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});
});
