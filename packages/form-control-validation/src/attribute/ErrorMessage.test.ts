import { beforeAll, expect, test } from '@jest/globals';
import ErrorMessage from './ErrorMessage.ts';

beforeAll(() => {
	document.body.innerHTML = `<p id="message"></p>`;
});

test('no attribute', () => {
	expect(() => {
		new ErrorMessage(undefined);
	}).toThrow(new Error('The `aria-errormessage` attribute is not set'));
});

test('no element', () => {
	expect(() => {
		new ErrorMessage('xxx');
	}).toThrow(new Error('Element `#xxx` not found'));
});

test('exist element', () => {
	const { element } = new ErrorMessage('message');

	expect(element.id).toBe('message');
});
