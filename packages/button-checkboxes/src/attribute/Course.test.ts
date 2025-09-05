import { describe, test, expect } from '@jest/globals';
import Course from './Course.ts';

describe('constructor', () => {
	test('no course attribute', () => {
		expect(() => {
			new Course(undefined);
		}).toThrow('The `data-course` attribute is not set.');
	});

	test('not allowed value', () => {
		expect(() => {
			new Course('xxx');
		}).toThrow('The value of the `data-course` attribute must be "check" or "uncheck".');
	});

	test('allowed value', () => {
		expect(new Course('check').value).toBe('check');
	});
});
