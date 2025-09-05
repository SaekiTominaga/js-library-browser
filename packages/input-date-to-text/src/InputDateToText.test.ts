import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import InputDateToText from './InputDateToText.ts';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('type', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" data-validation-noexist="">');

		const input = document.querySelector('input')!;

		new InputDateToText(input);

		expect(input.type).toBe('text');
	});

	test('data-title', () => {
		document.body.insertAdjacentHTML('beforeend', '<input data-validation-noexist="" data-title="title">');

		const input = document.querySelector('input')!;

		new InputDateToText(input);

		expect(input.title).toBe('title');
	});

	test('min', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" data-validation-noexist="" min="2000-01-01" data-validation-min="">');

		const input = document.querySelector('input')!;

		new InputDateToText(input);

		expect(input.min).toBe('');
	});

	test('max', () => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" data-validation-noexist="" max="2020-12-31" data-validation-max="">');

		const input = document.querySelector('input')!;

		new InputDateToText(input);

		expect(input.max).toBe('');
	});

	test('step', () => {
		document.body.insertAdjacentHTML('beforeend', '<input data-validation-noexist="" step="1">');

		const input = document.querySelector('input')!;

		new InputDateToText(input);

		expect(input.step).toBe('');
	});
});

describe('change event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" data-validation-noexist="This date does not exist.">');

		new InputDateToText(document.querySelector('input')!);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input');

		element?.dispatchEvent(new Event('change'));

		expect(element?.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input')!;

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		/* TODO: */
	});
});

describe('submit event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<form><input type="date" data-validation-noexist="This date does not exist."></form>');

		new InputDateToText(document.querySelector('input')!);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('empty', () => {
		const element = document.querySelector('input');

		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		expect(element?.value).toBe('');
	});

	test('invalid format', () => {
		const element = document.querySelector('input')!;

		element.value = 'foo';
		document.querySelector('form')?.dispatchEvent(new Event('submit'));

		/* TODO: */
	});
});

describe('value pattern', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML('beforeend', '<input type="date" data-validation-noexist="This date does not exist.">');

		new InputDateToText(document.querySelector('input')!);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('zenkaku', () => {
		const element = document.querySelector('input')!;

		element.value = '２０００－０１－０１';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('20000101', () => {
		const element = document.querySelector('input')!;

		element.value = '20000101';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('2000/1/1', () => {
		const element = document.querySelector('input')!;

		element.value = '2000/1/1';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});

	test('2000-1-1', () => {
		const element = document.querySelector('input')!;

		element.value = '2000-1-1';
		element.dispatchEvent(new Event('change'));

		expect(element.value).toBe('2000-01-01');
	});
});

describe('invalid value', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<input type="date" min="2000-01-01" max="2020-12-31" data-validation-noexist="This date does not exist." data-validation-min="Please enter a value after A.D.2000." data-validation-max="Please enter a value before A.D.2020.">',
		);

		new InputDateToText(document.querySelector('input')!);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no exist date', () => {
		const element = document.querySelector('input')!;

		element.value = '2000-02-31';
		element.dispatchEvent(new Event('change'));

		/* TODO: */
	});

	test('past', () => {
		const element = document.querySelector('input')!;

		element.value = '1999-12-31';
		element.dispatchEvent(new Event('change'));

		/* TODO: */
	});

	test('future', () => {
		const element = document.querySelector('input')!;

		element.value = '2099-01-01';
		element.dispatchEvent(new Event('change'));

		/* TODO: */
	});
});
