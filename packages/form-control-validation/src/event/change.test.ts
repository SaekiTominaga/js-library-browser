import { beforeAll, expect, test } from '@jest/globals';
import ErrorMessage from '../attribute/ErrorMessage.ts';
import changeEvent from './change.ts';

beforeAll(() => {
	document.body.innerHTML = `
<input required aria-errormessage="message" aria-invalid="true">
<p id="message">error message</p>
`;
});

test('change event', () => {
	const inputElement = document.querySelector('input')!;
	const errorMessage = new ErrorMessage(inputElement.getAttribute('aria-errormessage'));

	expect(inputElement.getAttribute('aria-invalid')).toBe('true');
	expect(inputElement.validationMessage).not.toBe('');
	expect(errorMessage.element.hidden).toBeFalsy();
	expect(errorMessage.element.innerHTML).toBe('error message');

	inputElement.value = 'foo';

	const event = new Event('change');

	changeEvent(event, {
		targetElement: inputElement,
		formControlElements: [inputElement],
		errorMessage: errorMessage,
	});

	expect(inputElement.getAttribute('aria-invalid')).toBe('false');
	expect(inputElement.validationMessage).toBe('');
	expect(errorMessage.element.hidden).toBeTruthy();
	expect(errorMessage.element.innerHTML).toBe('');
});
