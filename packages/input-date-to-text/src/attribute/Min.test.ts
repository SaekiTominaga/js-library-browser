import { describe, test, expect } from '@jest/globals';
import Min from './Min.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Min(undefined).value).toBeUndefined();
	});

	test('invalid format', () => {
		expect(() => {
			new Min('20000101');
		}).toThrow('The format of the `min` attribute must be `YYYY-MM-DD`.');
	});

	test('valid', () => {
		expect(new Min('2000-01-01').value?.getTime()).toBe(new Date(2000, 0, 1).getTime());
	});
});
