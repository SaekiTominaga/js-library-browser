import { describe, beforeEach, test, expect } from '@jest/globals';
import ValidationMessageNoExist from './ValidationMessageNoExist.ts';

describe('constructor', () => {
	beforeEach(() => {
		document.body.innerHTML = '<input />';
	});

	test('no attribute', () => {
		expect(() => {
			new ValidationMessageNoExist(undefined);
		}).toThrow('The `data-validation-noexist` attribute is not set.');
	});

	test('valid string', () => {
		expect(new ValidationMessageNoExist('noexist').value).toBe('noexist');
	});
});
