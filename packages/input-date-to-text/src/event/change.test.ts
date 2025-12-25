import { expect, jest, test } from '@jest/globals';
import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import changeEvent from './change.ts';

test('HTMLInputElement.validity.patternMismatch', () => {
	const inputElement = document.createElement('input');
	inputElement.pattern = 'foo';
	inputElement.value = 'bar';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist('');
	const validationMessageMin = new ValidationMessageMin('', inputElement);
	const validationMessageMax = new ValidationMessageMax('', inputElement);

	const event = new Event('invalid');
	Object.defineProperty(event, 'currentTarget', { value: inputElement, writable: false });

	const invalidEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

	changeEvent(event, {
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect(inputElement.validationMessage).not.toBe('');
	expect(invalidEventSpy).not.toHaveBeenCalled(); // dispatchEvent() が呼び出されていない＝ブラウザ標準機能によるエラー

	invalidEventSpy.mockRestore();
});

test('validate method', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';

	const inputElement = document.createElement('input');
	inputElement.value = '2000-02-31';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
	const validationMessageMin = new ValidationMessageMin('', inputElement);
	const validationMessageMax = new ValidationMessageMax('', inputElement);

	const event = new Event('invalid');
	Object.defineProperty(event, 'currentTarget', { value: inputElement, writable: false });

	changeEvent(event, {
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
});
