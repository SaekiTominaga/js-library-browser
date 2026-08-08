import { expect, test } from '@jest/globals';
import Mouseenter from './Mouseenter.ts';

test('not number', () => {
	expect(() => {
		new Mouseenter({ delay: 'xxx' });
	}).toThrow(new Error('The value of the `data-mouseenter-delay` attribute must be a number'));
});

test('zero', () => {
	expect(() => {
		new Mouseenter({ delay: '0' });
	}).toThrow(new Error('The value of the `data-mouseenter-delay` attribute must be a number greater than zero'));
});

test('greater than 0', () => {
	expect(new Mouseenter({ delay: '1' }).delay).toBe(1);
});
