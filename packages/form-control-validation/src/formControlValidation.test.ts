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

	const $radiogroup = document.querySelector<HTMLElement>('[role="radiogroup"]')!;
	const $radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]');

	formControlValidation($radiogroup);

	[...$radios].at(0)?.dispatchEvent(new Event('change'));

	expect($radiogroup.getAttribute('aria-invalid')).toBe('true');
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
		const $input = document.querySelector('input')!;
		const $errorMessage = document.getElementById('message')!;

		$input.value = 'foo';
		$input.dispatchEvent(new Event('change'));

		expect($input.getAttribute('aria-invalid')).toBe('false');
		expect($errorMessage.hidden).toBeTruthy();
		expect($errorMessage.innerHTML).toBe('');
	});

	test('invalid', () => {
		const $input = document.querySelector('input')!;
		const $errorMessage = document.getElementById('message')!;

		$input.value = '';
		$input.dispatchEvent(new Event('change'));

		expect($input.getAttribute('aria-invalid')).toBe('true');
		expect($errorMessage.hidden).toBeFalsy();
		expect($errorMessage.innerHTML).not.toBe('');
	});
});

test('title attribute', () => {
	document.body.innerHTML = `
<input pattern="[A-Z]+" aria-errormessage="message" title="error message">
<p id="message"></p>
`;

	const $input = document.querySelector('input')!;

	formControlValidation($input);

	$input.value = 'foo';
	$input.dispatchEvent(new Event('change'));

	expect(document.getElementById('message')?.textContent).toBe('error message');
});
