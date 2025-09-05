import { describe, afterEach, test, expect } from '@jest/globals';
import ErrorMessage from './ErrorMessage.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
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
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="message"></p>
`,
		);

		const { element } = new ErrorMessage('message');

		expect(element.id).toBe('message');
	});
});
