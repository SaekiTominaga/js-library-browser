import { describe, test, expect } from '@jest/globals';
import Max from './Max.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Max(undefined).value).toBeUndefined();
	});

	test('invalid format', () => {
		expect(() => {
			new Max('20000101');
		}).toThrow('The format of the `max` attribute must be `YYYY-MM-DD`.');
	});

	test('valid', () => {
		expect(new Max('2000-01-01').value?.getTime()).toBe(new Date(2000, 0, 1).getTime());
	});
});
