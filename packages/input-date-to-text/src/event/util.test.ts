import { describe, expect, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
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
		const inputElement = document.createElement('input');

		const min = new Min(inputElement.min);
		const max = new Max(inputElement.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		inputElement.setCustomValidity(TEMP_MESSAGE);
		expect(inputElement.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});

	test('valid date', () => {
		const inputElement = document.createElement('input');
		inputElement.min = '2000-01-01';
		inputElement.max = '2099-12-31';
		inputElement.value = '2000-01-01';

		const min = new Min(inputElement.min);
		const max = new Max(inputElement.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		inputElement.setCustomValidity(TEMP_MESSAGE);
		expect(inputElement.validationMessage).toBe(TEMP_MESSAGE);

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
	});

	test('no exist date', () => {
		const inputElement = document.createElement('input');
		inputElement.value = '2000-02-31';

		const min = new Min(undefined);
		const max = new Max(undefined);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		expect(inputElement.validationMessage).toBe('');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	});

	test('past', () => {
		const inputElement = document.createElement('input');
		inputElement.min = '2000-01-01';
		inputElement.value = '1999-12-31';

		const min = new Min(inputElement.min);
		const max = new Max(undefined);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		expect(inputElement.validationMessage).toBe('');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_MIN);
	});

	test('future', () => {
		const inputElement = document.createElement('input');
		inputElement.max = '2100-01-01';
		inputElement.value = '2100-01-02';

		const min = new Min(undefined);
		const max = new Max(inputElement.max);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		expect(inputElement.validationMessage).toBe('');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_MAX);
	});
});
