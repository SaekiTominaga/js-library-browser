import { describe, beforeEach, test, expect } from '@jest/globals';
import ValidationMessageMax from './ValidationMessageMax.ts';

describe('constructor', () => {
	beforeEach(() => {
		document.body.innerHTML = '<input />';
	});

	test('no attribute', () => {
		expect(new ValidationMessageMax(undefined, document.querySelector('input')!).value).toBeUndefined();
	});

	test('valid string', () => {
		document.body.innerHTML = '<input max="xxx" />';

		expect(new ValidationMessageMax('max', document.querySelector('input')!).value).toBe('max');
	});
});

describe('constructor - max attribute', () => {
	beforeEach(() => {
		document.body.innerHTML = '<input max="xxx" />';
	});

	test('no attribute', () => {
		expect(() => {
			new ValidationMessageMax(undefined, document.querySelector('input')!);
		}).toThrow('The `data-validation-max` attribute is not set.');
	});

	test('valid string', () => {
		expect(new ValidationMessageMax('max', document.querySelector('input')!).value).toBe('max');
	});
});
