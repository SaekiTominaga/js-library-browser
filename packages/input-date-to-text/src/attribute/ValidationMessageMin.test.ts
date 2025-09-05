import { describe, beforeEach, test, expect } from '@jest/globals';
import ValidationMessageMin from './ValidationMessageMin.ts';

describe('constructor', () => {
	beforeEach(() => {
		document.body.innerHTML = '<input />';
	});

	test('no attribute', () => {
		expect(new ValidationMessageMin(undefined, document.querySelector('input')!).value).toBeUndefined();
	});

	test('valid string', () => {
		document.body.innerHTML = '<input min="xxx" />';

		expect(new ValidationMessageMin('min', document.querySelector('input')!).value).toBe('min');
	});
});

describe('constructor - min attribute', () => {
	beforeEach(() => {
		document.body.innerHTML = '<input min="xxx" />';
	});

	test('no attribute', () => {
		expect(() => {
			new ValidationMessageMin(undefined, document.querySelector('input')!);
		}).toThrow('The `data-validation-min` attribute is not set.');
	});

	test('valid string', () => {
		expect(new ValidationMessageMin('min', document.querySelector('input')!).value).toBe('min');
	});
});
