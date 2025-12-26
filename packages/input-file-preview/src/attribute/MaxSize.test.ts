import { expect, test } from '@jest/globals';
import MaxSize from './MaxSize.ts';

test('no attribute', () => {
	expect(new MaxSize(undefined).value).toBeUndefined();
});

test('not number', () => {
	expect(() => {
		new MaxSize('xxx');
	}).toThrow('The value of the `data-max-size` attribute must be a number.');
});

test('negative number', () => {
	expect(() => {
		new MaxSize('-1');
	}).toThrow('The value of the `data-max-size` attribute must be a positive number.');
});

test('zero', () => {
	expect(new MaxSize('0').value).toBe(0);
});

test('positive number', () => {
	expect(new MaxSize('0.1').value).toBe(0.1);
});
