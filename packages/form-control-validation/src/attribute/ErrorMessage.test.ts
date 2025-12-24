import { beforeAll, expect, test } from '@jest/globals';
import ErrorMessage from './ErrorMessage.ts';

beforeAll(() => {
	document.body.innerHTML = `<p id="message"></p>`;
});

test('no attribute', () => {
	expect(() => {
		new ErrorMessage(undefined);
	}).toThrow('The `aria-errormessage` attribute is not set.');
});

test('no element', () => {
	expect(() => {
		new ErrorMessage('xxx');
	}).toThrow('Element `#xxx` not found.');
});

test('exist element', () => {
	const { element } = new ErrorMessage('message');

	expect(element.id).toBe('message');
});
