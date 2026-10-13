import { beforeAll, expect, test } from '@jest/globals';
import ErrorMessage from './ErrorMessage.ts';

beforeAll(() => {
	document.body.innerHTML = `
<p id="message-p"></p>
<table id="message-table"></table>
`;
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

test('invalid tag name', () => {
	expect(() => {
		new ErrorMessage('message-table');
	}).toThrow(new TypeError('Element `#message-table` cannot set `role=alert` or cannot set a error message using `textContent` property'));
});

test('exist element', () => {
	const { element } = new ErrorMessage('message-p');

	expect(element.id).toBe('message-p');
});
