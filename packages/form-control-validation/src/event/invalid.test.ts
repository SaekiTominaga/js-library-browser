import { beforeAll, expect, test } from '@jest/globals';
import ErrorMessage from '../attribute/ErrorMessage.ts';
import Title from '../attribute/Title.ts';
import invalidEvent from './invalid.ts';

beforeAll(() => {
	document.body.innerHTML = `
<input aria-errormessage="message">
<p id="message" hidden></p>
`;
});

test('invalid event', () => {
	const $input = document.querySelector('input')!;
	const title = new Title($input.getAttribute('title'));
	const errorMessage = new ErrorMessage($input.getAttribute('aria-errormessage'));

	expect($input.getAttribute('aria-invalid')).toBeNull();
	expect($input.validationMessage).toBe('');
	expect(errorMessage.element.hidden).toBeTruthy();
	expect(errorMessage.element.innerHTML).toBe('');

	const event = new Event('invalid');

	$input.setCustomValidity('error message');
	Object.defineProperty(event, 'currentTarget', { value: $input });
	invalidEvent(event, {
		targetElement: $input,
		formControlElements: [$input],
		errorMessage: errorMessage,
		title: title,
	});

	expect($input.getAttribute('aria-invalid')).toBe('true');
	expect($input.validationMessage).toBe('error message');
	expect(errorMessage.element.hidden).toBeFalsy();
	expect(errorMessage.element.innerHTML).toBe('error message');
});
