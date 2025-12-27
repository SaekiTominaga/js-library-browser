import { expect, test } from '@jest/globals';
import ValidationMessageIsbnCheckdigit from './ValidationMessageIsbnCheckdigit.ts';

test('no attribute', () => {
	expect(() => {
		new ValidationMessageIsbnCheckdigit(undefined);
	}).toThrow('The `data-validation-message-isbn-checkdigit` attribute is not set.');
});

test('valid string', () => {
	expect(new ValidationMessageIsbnCheckdigit('message').value).toBe('message');
});
