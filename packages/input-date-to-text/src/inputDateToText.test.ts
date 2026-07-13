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

		const $input = document.querySelector('input')!;

		inputDateToText($input);

		expect($input.min).toBe('');
		expect($input.max).toBe('');
		expect($input.step).toBe('');
	});

	test('date → text', () => {
		document.body.innerHTML = `<input type="date" data-validation-noexist="">`;

		const $input = document.querySelector('input')!;

		expect($input.type).toBe('date');

		inputDateToText($input);

		expect($input.type).toBe('text');
		expect($input.minLength).toBe(8);
		expect($input.pattern).toBe('([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})');
		expect($input.placeholder).toBe('YYYY-MM-DD');
	});

	test('data-title', () => {
		const TITLE_ATTRIBUTE_VALUE = 'title';

		document.body.innerHTML = `<input data-validation-noexist="" data-title="${TITLE_ATTRIBUTE_VALUE}">`;

		const $input = document.querySelector('input')!;

		expect($input.dataset['title']).toBe(TITLE_ATTRIBUTE_VALUE);
		expect($input.title).toBe('');

		inputDateToText($input);

		expect($input.dataset['title']).toBeUndefined();
		expect($input.title).toBe(TITLE_ATTRIBUTE_VALUE);
	});
});

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<form><input type="date" data-validation-noexist=""></form>`;

		inputDateToText(document.querySelector('input')!);
	});

	test('change', () => {
		const $input = document.querySelector('input')!;

		$input.dispatchEvent(new Event('change'));

		expect($input.validationMessage).toBe('');
	});

	test('submit', () => {
		const $form = document.querySelector('form')!;
		const $input = document.querySelector('input')!;

		$form.dispatchEvent(new Event('submit'));

		expect($input.validationMessage).toBe('');
	});
});
