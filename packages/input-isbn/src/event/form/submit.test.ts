import { afterEach, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import ValidationMessageIsbnCheckdigit from '../../attribute/ValidationMessageIsbnCheckdigit.ts';
import submitEvent from './submit.ts';

let preventDefaultSpy: SpiedFunction;

afterEach(() => {
	preventDefaultSpy.mockRestore();
});

test('valid', () => {
	const $input = document.createElement('input');

	const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit('');

	const event = new Event('submit') as SubmitEvent;

	preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement: $input,
		validationMessageIsbnCheckdigit,
	});

	expect($input.validationMessage).toBe('');
	expect(preventDefaultSpy).not.toHaveBeenCalled();
});

test('invalid', () => {
	const VALIDATION_MESSAGE_ISBN_CHECKDIGIT = 'ISBN check digit message';

	const $input = document.createElement('input');
	$input.value = '978-4-06-519981-0';

	const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);

	const event = new Event('submit') as SubmitEvent;

	preventDefaultSpy = jest.spyOn(event, 'preventDefault');

	submitEvent(event, {
		inputElement: $input,
		validationMessageIsbnCheckdigit,
	});

	expect($input.validationMessage).toBe(VALIDATION_MESSAGE_ISBN_CHECKDIGIT);
	expect(preventDefaultSpy).toHaveBeenCalledWith();
});
