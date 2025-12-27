import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import inputIsbn from './inputIsbn.ts';

describe('attribute', () => {
	beforeAll(() => {
		document.body.innerHTML = `<input data-validation-message-isbn-checkdigit="ISBN check digit is invalid.">`;
	});

	test('set', () => {
		const inputElement = document.querySelector('input')!;

		inputIsbn(inputElement);

		expect(inputElement.minLength).toBe(10);
		expect(inputElement.maxLength).toBe(17);
		expect(inputElement.pattern).toBe('(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]');
	});
});

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<form><input value="foo" data-validation-message-isbn-checkdigit="ISBN check digit is invalid."></form>`;

		inputIsbn(document.querySelector('input')!);
	});

	test('change', () => {
		const inputElement = document.querySelector('input')!;

		const changeEventSpy = jest.spyOn(inputElement, 'dispatchEvent');

		inputElement.dispatchEvent(new Event('change'));

		expect(inputElement.validationMessage).not.toBe('');
		expect(changeEventSpy).toHaveBeenCalled();

		changeEventSpy.mockRestore();
	});

	test('form submit', () => {
		const submitEvent = new Event('submit');
		const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');

		document.querySelector('form')?.dispatchEvent(submitEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();

		preventDefaultSpy.mockRestore();
	});
});
