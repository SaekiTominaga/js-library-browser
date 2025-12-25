import { describe, expect, jest, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import { convertValue, validate } from './util.ts';

describe('convertValue', () => {
	const inputElement = document.createElement('input');

	test('empty', () => {
		inputElement.value = ' ';

		convertValue(inputElement);

		expect(inputElement.value).toBe('');
	});

	test('zenkaku', () => {
		inputElement.value = '２０００－０１－０１';

		convertValue(inputElement);

		expect(inputElement.value).toBe('2000-01-01');
	});

	test('20000101', () => {
		inputElement.value = '20000101';

		convertValue(inputElement);

		expect(inputElement.value).toBe('2000-01-01');
	});

	test('2000/1/1', () => {
		inputElement.value = '2000/1/1';

		convertValue(inputElement);

		expect(inputElement.value).toBe('2000-01-01');
	});

	test('2000-1-1', () => {
		inputElement.value = '2000-1-1';

		convertValue(inputElement);

		expect(inputElement.value).toBe('2000-01-01');
	});
});

describe('const result = validate', () => {
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

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
		expect(invalidEventSpy).not.toHaveBeenCalled();

		invalidEventSpy.mockRestore();
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

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeTruthy();
		expect(inputElement.validationMessage).toBe('');
		expect(invalidEventSpy).not.toHaveBeenCalled();

		invalidEventSpy.mockRestore();
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

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
		expect(invalidEventSpy).toHaveBeenCalled();

		invalidEventSpy.mockRestore();
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

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_MIN);
		expect(invalidEventSpy).toHaveBeenCalled();

		invalidEventSpy.mockRestore();
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

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_MAX);
		expect(invalidEventSpy).toHaveBeenCalled();

		invalidEventSpy.mockRestore();
	});

	test('validation message undefined', () => {
		const inputElement = document.createElement('input');
		inputElement.min = ''; // min 属性値が空
		inputElement.value = '1999-12-31';

		const min = new Min('2000-01-01'); // min 属性値が空なのに過去日エラーを無理矢理発生させる
		const max = new Max(undefined);
		const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
		const validationMessageMin = new ValidationMessageMin(VALIDATION_MESSAGE_MIN, inputElement);
		const validationMessageMax = new ValidationMessageMax(VALIDATION_MESSAGE_MAX, inputElement);

		expect(inputElement.validationMessage).toBe('');

		const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		const result = validate(inputElement, { min, max, validationMessageNoExist, validationMessageMin, validationMessageMax });

		expect(result).toBeFalsy();
		expect(inputElement.validationMessage).toBe(''); // TODO: 実際はあり得ない想定だが、エラーが発生しているのにバリデーションメッセージがセットされない矛盾は一考の余地あり
		expect(invalidEventSpy).not.toHaveBeenCalled();

		invalidEventSpy.mockRestore();
	});
});
