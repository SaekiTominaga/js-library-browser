import { beforeAll, describe, expect, test } from '@jest/globals';
import formControlValidation from './formControlValidation.ts';

test('message element role', () => {
	document.body.innerHTML = `
<input aria-errormessage="message">
<p id="message"></p>
`;

	formControlValidation(document.querySelector('input')!);

	expect(document.getElementById('message')?.getAttribute('role')).toBe('alert');
});

test('radiogroup', () => {
	document.body.innerHTML = `
<div role="radiogroup" aria-errormessage="message">
<input type="radio" required>
</div>
<p id="message"></p>
`;

	const radiogroupElement = document.querySelector<HTMLElement>('[role="radiogroup"]')!;
	const radioElements = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');

	formControlValidation(radiogroupElement);

	[...radioElements].at(0)?.dispatchEvent(new Event('change'));

	expect(radiogroupElement.getAttribute('aria-invalid')).toBe('true');
});

test('invalid element', () => {
	document.body.innerHTML = `
<div aria-errormessage="message"></div>
<p id="message"></p>
`;

	expect(() => {
		formControlValidation(document.querySelector('div')!);
	}).toThrow('The `formControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`.');
});

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<input required="" aria-errormessage="message">
<p id="message"></p>
`;

		formControlValidation(document.querySelector('input')!);
	});

	test('valid', () => {
		const inputElement = document.querySelector('input')!;
		const errorMessageElement = document.getElementById('message')!;

		inputElement.value = 'foo';
		inputElement.dispatchEvent(new Event('change'));

		expect(inputElement.getAttribute('aria-invalid')).toBe('false');
		expect(errorMessageElement.hidden).toBeTruthy();
		expect(errorMessageElement.innerHTML).toBe('');
	});

	test('invalid', () => {
		const inputElement = document.querySelector('input')!;
		const errorMessageElement = document.getElementById('message')!;

		inputElement.value = '';
		inputElement.dispatchEvent(new Event('change'));

		expect(inputElement.getAttribute('aria-invalid')).toBe('true');
		expect(errorMessageElement.hidden).toBeFalsy();
		expect(errorMessageElement.innerHTML).not.toBe('');
	});
});

test('title attribute', () => {
	document.body.innerHTML = `
<input pattern="[A-Z]+" aria-errormessage="message" title="error message">
<p id="message"></p>
`;

	const inputElement = document.querySelector('input')!;

	formControlValidation(inputElement);

	inputElement.value = 'foo';
	inputElement.dispatchEvent(new Event('change'));

	expect(document.getElementById('message')?.textContent).toBe('error message');
});
