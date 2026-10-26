import { expect, test } from '@jest/globals';
import { parseDuration } from './cssUnits.ts';

test('invalid value', () => {
	expect(() => {
		parseDuration('xxx');
	}).toThrow(new Error('Invalid time format: xxx'));
});

test('no unit', () => {
	expect(() => {
		parseDuration('10');
	}).toThrow(new Error('Invalid time format: 10'));
});

test('ms', () => {
	expect(parseDuration('10ms')).toBe(10);
});

test('s', () => {
	expect(parseDuration('10s')).toBe(10_000);
});

test('invalid unit', () => {
	expect(() => {
		parseDuration('10m');
	}).toThrow(new Error('Invalid time format: 10m'));
});

test('zero', () => {
	expect(parseDuration('0s')).toBe(0);
});

test('decimals', () => {
	expect(parseDuration('1.2s')).toBe(1200);
});

test('minus', () => {
	expect(parseDuration('-1s')).toBe(-1000);
});
