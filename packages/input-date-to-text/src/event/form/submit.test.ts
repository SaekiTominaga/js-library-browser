import { expect, jest, test } from '@jest/globals';
import Max from '../../attribute/Max.ts';
import Min from '../../attribute/Min.ts';
import ValidationMessageMax from '../../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../../attribute/ValidationMessageNoExist.ts';
import submitEvent from './submit.ts';

test('valid', () => {
	const inputElement = document.createElement('input');

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist('');
	const validationMessageMin = new ValidationMessageMin('', inputElement);
	const validationMessageMax = new ValidationMessageMax('', inputElement);

	const event = new Event('submit') as SubmitEvent;

	const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement,
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect(inputElement.validationMessage).toBe('');
	expect(preventDefaultSpy).not.toHaveBeenCalled();

	preventDefaultSpy.mockRestore();
});

test('invalid', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';

	const inputElement = document.createElement('input');
	inputElement.value = '2000-02-31';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
	const validationMessageMin = new ValidationMessageMin('', inputElement);
	const validationMessageMax = new ValidationMessageMax('', inputElement);

	const event = new Event('submit') as SubmitEvent;

	const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement,
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect(inputElement.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	expect(preventDefaultSpy).toHaveBeenCalled();

	preventDefaultSpy.mockRestore();
});
