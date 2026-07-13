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
	const $input = document.querySelector('input')!;
	const errorMessage = new ErrorMessage($input.getAttribute('aria-errormessage'));

	expect($input.getAttribute('aria-invalid')).toBe('true');
	expect($input.validationMessage).not.toBe('');
	expect(errorMessage.element.hidden).toBeFalsy();
	expect(errorMessage.element.innerHTML).toBe('error message');

	$input.value = 'foo';

	const event = new Event('change');

	changeEvent(event, {
		targetElement: $input,
		formControlElements: [$input],
		errorMessage: errorMessage,
	});

	expect($input.getAttribute('aria-invalid')).toBe('false');
	expect($input.validationMessage).toBe('');
	expect(errorMessage.element.hidden).toBeTruthy();
	expect(errorMessage.element.innerHTML).toBe('');
});
