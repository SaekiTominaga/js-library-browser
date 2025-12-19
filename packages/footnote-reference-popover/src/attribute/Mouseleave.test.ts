import { expect, test } from '@jest/globals';
import Mouseleave from './Mouseleave.ts';

test('not number', () => {
	expect(() => {
		new Mouseleave({ delay: 'xxx' });
	}).toThrow('The value of the `data-mouseleave-delay` attribute must be a number.');
});

test('zero', () => {
	expect(() => {
		new Mouseleave({ delay: '0' });
	}).toThrow('The value of the `data-mouseleave-delay` attribute must be a number greater than zero.');
});

test('greater than 0', () => {
	expect(new Mouseleave({ delay: '1' }).delay).toBe(1);
});
