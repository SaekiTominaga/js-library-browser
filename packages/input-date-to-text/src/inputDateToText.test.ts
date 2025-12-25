import { beforeAll, describe, expect, test } from '@jest/globals';
import inputDateToText from './inputDateToText.ts';

describe('attribute', () => {
	test('remove attribute', () => {
		document.body.innerHTML = `
<input type="date" data-validation-noexist=""
  min="2000-01-01" data-validation-min=""
  max="2020-12-31" data-validation-max=""
  step="1"
>`;

		const inputElement = document.querySelector('input')!;

		inputDateToText(inputElement);

		expect(inputElement.min).toBe('');
		expect(inputElement.max).toBe('');
		expect(inputElement.step).toBe('');
	});

	test('date → text', () => {
		document.body.innerHTML = `<input type="date" data-validation-noexist="">`;

		const inputElement = document.querySelector('input')!;

		expect(inputElement.type).toBe('date');

		inputDateToText(inputElement);

		expect(inputElement.type).toBe('text');
		expect(inputElement.minLength).toBe(8);
		expect(inputElement.pattern).toBe('([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})');
		expect(inputElement.placeholder).toBe('YYYY-MM-DD');
	});

	test('data-title', () => {
		const TITLE_ATTRIBUTE_VALUE = 'title';

		document.body.innerHTML = `<input data-validation-noexist="" data-title="${TITLE_ATTRIBUTE_VALUE}">`;

		const inputElement = document.querySelector('input')!;

		expect(inputElement.dataset['title']).toBe(TITLE_ATTRIBUTE_VALUE);
		expect(inputElement.title).toBe('');

		inputDateToText(inputElement);

		expect(inputElement.dataset['title']).toBeUndefined();
		expect(inputElement.title).toBe(TITLE_ATTRIBUTE_VALUE);
	});
});

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<form><input type="date" data-validation-noexist=""></form>`;

		inputDateToText(document.querySelector('input')!);
	});

	test('change', () => {
		const inputElement = document.querySelector('input')!;

		inputElement.dispatchEvent(new Event('change'));

		expect(inputElement.validationMessage).toBe('');
	});

	test('submit', () => {
		const formElement = document.querySelector('form')!;
		const inputElement = document.querySelector('input')!;

		formElement.dispatchEvent(new Event('submit'));

		expect(inputElement.validationMessage).toBe('');
	});
});
