import { describe, afterEach, test, expect } from '@jest/globals';
import Message from './Message.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Message(undefined);
		}).toThrow('The `data-message` attribute is not set.');
	});

	test('text', () => {
		expect(new Message('text').text).toBe('text');
	});
});
