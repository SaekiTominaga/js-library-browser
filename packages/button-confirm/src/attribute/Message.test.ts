import { expect, test } from '@jest/globals';
import Message from './Message.ts';

test('no attribute', () => {
	expect(() => {
		new Message(undefined);
	}).toThrow('The `data-message` attribute is not set.');
});

test('text', () => {
	expect(new Message('text').text).toBe('text');
});
