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
	const inputElement = document.querySelector('input')!;
	const title = new Title(inputElement.getAttribute('title'));
	const errorMessage = new ErrorMessage(inputElement.getAttribute('aria-errormessage'));

	expect(inputElement.getAttribute('aria-invalid')).toBeNull();
	expect(inputElement.validationMessage).toBe('');
	expect(errorMessage.element.hidden).toBeTruthy();
	expect(errorMessage.element.innerHTML).toBe('');

	const event = new Event('invalid');

	inputElement.setCustomValidity('error message');
	Object.defineProperty(event, 'currentTarget', { value: inputElement, writable: false });
	invalidEvent(event, {
		targetElement: inputElement,
		formControlElements: [inputElement],
		errorMessage: errorMessage,
		title: title,
	});

	expect(inputElement.getAttribute('aria-invalid')).toBe('true');
	expect(inputElement.validationMessage).toBe('error message');
	expect(errorMessage.element.hidden).toBeFalsy();
	expect(errorMessage.element.innerHTML).toBe('error message');
});
