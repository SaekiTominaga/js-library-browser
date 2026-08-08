import { expect, test } from '@jest/globals';
import formControlValidation from './formControlValidation.ts';

test('invalid element', () => {
	document.body.innerHTML = `
<div aria-errormessage="message"></div>
<p id="message"></p>
`;

	expect(() => {
		formControlValidation(document.querySelector('div')!);
	}).toThrow(new Error('The `formControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`'));
});
