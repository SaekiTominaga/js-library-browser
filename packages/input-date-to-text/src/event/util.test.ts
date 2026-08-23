import { describe, expect, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import { convertValue, validate } from './util.ts';

describe('convertValue', () => {
	test('empty', () => {
		expect(convertValue(' ')).toBe('');
	});

	test('zenkaku', () => {
		expect(convertValue(' ２０００－０１－０１ ')).toBe('2000-01-01');
	});

	test('YYYYMMDD', () => {
		expect(convertValue(' 20000101 ')).toBe('2000-01-01');
	});

	test('YYYY/M/D', () => {
		expect(convertValue(' 2000/1/1 ')).toBe('2000-01-01');
	});

	test('YYYY-M-D', () => {
		expect(convertValue(' 2000-1-1 ')).toBe('2000-01-01');
	});

	test('invalid string', () => {
		expect(convertValue(' foo ')).toBe('foo');
	});
});

describe('validate', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';
	const VALIDATION_MESSAGE_MIN = 'min message';
	const VALIDATION_MESSAGE_MAX = 'max message';
	const TEMP_MESSAGE = 'temp message';

	test('empty', () => {
		const $input = document.createElement('input');

		const min = new Min($input.min);
		const max = new Max($input.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, $input);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, $input);

		$input.setCustomValidity(TEMP_MESSAGE);
		expect($input.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate($input, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});

	test('valid date', () => {
		const $input = document.createElement('input');
		$input.min = '2000-01-01';
		$input.max = '2099-12-31';
		$input.value = '2000-01-01';

		const min = new Min($input.min);
		const max = new Max($input.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, $input);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, $input);

		$input.setCustomValidity(TEMP_MESSAGE);
		expect($input.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate($input, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect($input.validationMessage).toBe('');
	});

	test('no exist date', () => {
		const $input = document.createElement('input');
		$input.value = '2000-02-31';

		const min = new Min(undefined);
		const max = new Max(undefined);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, $input);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, $input);

		expect($input.validationMessage).toBe('');

		const result = validate($input, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('past', () => {
		const $input = document.createElement('input');
		$input.min = '2000-01-01';
		$input.value = '1999-12-31';

		const min = new Min($input.min);
		const max = new Max(undefined);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, $input);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, $input);

		expect($input.validationMessage).toBe('');

		const result = validate($input, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_MIN);
	});

	test('future', () => {
		const $input = document.createElement('input');
		$input.max = '2100-01-01';
		$input.value = '2100-01-02';

		const min = new Min(undefined);
		const max = new Max($input.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, $input);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, $input);

		expect($input.validationMessage).toBe('');

		const result = validate($input, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect($input.validationMessage).toBe(VALIDATION_MESSAGE_MAX);
	});
});
