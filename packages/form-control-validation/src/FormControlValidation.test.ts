import { describe, beforeEach, afterEach, test, expect } from '@jest/globals';
import FormControlValidation from './FormControlValidation.ts';

describe('element', () => {
	beforeEach(() => {
		document.body.innerHTML = '<p id="message"></p>';
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('form control', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input aria-errormessage="message">
`,
		);

		new FormControlValidation(document.querySelector('input')!);
	});

	test('radiogroup', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<div role="radiogroup" aria-errormessage="message">
<input type="radio">
</div>
`,
		);

		new FormControlValidation(document.querySelector('[role="radiogroup"]')!);
	});

	test('Other than form controls', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<div aria-errormessage="message"></div>
`,
		);

		expect(() => {
			new FormControlValidation(document.querySelector('[aria-errormessage]')!);
		}).toThrow('The `FormControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`.');
	});

	test('message role', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input aria-errormessage="message">
`,
		);

		new FormControlValidation(document.querySelector('input')!);

		expect(document.getElementById('message')?.getAttribute('role')).toBe('alert');
	});
});

describe('event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input required="" aria-errormessage="message">
<p id="message"></p>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('change - valid', () => {
		const element = document.querySelector('input')!;

		new FormControlValidation(element);

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="false">
<p id="message" role="alert" hidden=""></p>
`);
	});

	test('change - invalid', () => {
		const element = document.querySelector('input')!;

		new FormControlValidation(element);

		element.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="true">
<p id="message" role="alert">Constraints not satisfied</p>
`);
	});

	test('invalid', () => {
		const element = document.querySelector('input')!;

		new FormControlValidation(element);

		element.dispatchEvent(new Event('invalid'));

		expect(document.body.innerHTML).toBe(`
<input required="" aria-errormessage="message" aria-invalid="true">
<p id="message" role="alert">Constraints not satisfied</p>
`);
	});
});

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('title', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input pattern="[A-Z]+" aria-errormessage="message" title="error message">
<p id="message"></p>
`,
		);

		const element = document.querySelector('input')!;

		new FormControlValidation(element);

		element.value = 'foo';
		element.dispatchEvent(new Event('change'));

		expect(document.getElementById('message')?.textContent).toBe('error message');
	});
});
