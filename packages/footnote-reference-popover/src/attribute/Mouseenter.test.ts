import { describe, test, expect } from '@jest/globals';
import Mouseenter from './Mouseenter.ts';

describe('constructor - delay', () => {
	test('no attribute', () => {
		expect(new Mouseenter({ delay: undefined }).delay).toBeUndefined();
	});

	test('not number', () => {
		expect(() => {
			new Mouseenter({ delay: 'xxx' });
		}).toThrow('The value of the `data-mouseenter-delay` attribute must be a number.');
	});

	test('zero', () => {
		expect(() => {
			new Mouseenter({ delay: '0' });
		}).toThrow('The value of the `data-mouseenter-delay` attribute must be a number greater than zero.');
	});

	test('greater than 0', () => {
		expect(new Mouseenter({ delay: '1' }).delay).toBe(1);
	});
});
