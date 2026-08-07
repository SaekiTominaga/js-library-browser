import { expect, jest, test } from '@jest/globals';
import Max from '../../attribute/Max.ts';
import Min from '../../attribute/Min.ts';
import ValidationMessageMax from '../../attribute/ValidationMessageMax.ts';
import ValidationMessageMin from '../../attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from '../../attribute/ValidationMessageNoExist.ts';
import submitEvent from './submit.ts';

test('valid', () => {
	const $input = document.createElement('input');

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist('');
	const validationMessageMin = new ValidationMessageMin('', $input);
	const validationMessageMax = new ValidationMessageMax('', $input);

	const event = new Event('submit') as SubmitEvent;

	const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement: $input,
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect($input.validationMessage).toBe('');
	expect(preventDefaultSpy).not.toHaveBeenCalled();

	preventDefaultSpy.mockRestore();
});

test('invalid', () => {
	const VALIDATION_MESSAGE_NO_EXIST = 'no exist message';

	const $input = document.createElement('input');
	$input.value = '2000-02-31';

	const min = new Min(undefined);
	const max = new Max(undefined);
	const validationMessageNoExist = new ValidationMessageNoExist(VALIDATION_MESSAGE_NO_EXIST);
	const validationMessageMin = new ValidationMessageMin('', $input);
	const validationMessageMax = new ValidationMessageMax('', $input);

	const event = new Event('submit') as SubmitEvent;

	const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement: $input,
		min,
		max,
		validationMessageNoExist,
		validationMessageMin,
		validationMessageMax,
	});

	expect($input.validationMessage).toBe(VALIDATION_MESSAGE_NO_EXIST);
	expect(preventDefaultSpy).toHaveBeenCalled();

	preventDefaultSpy.mockRestore();
});
