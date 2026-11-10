import { describe, expect, test } from '@jest/globals';
import { formatNumber } from './htmlAttr.ts';

describe('format', () => {
	test('integer', () => {
		expect(formatNumber(1)).toBe('1');
	});

	test('round', () => {
		expect(formatNumber(1.2344)).toBe('1.234');
		expect(formatNumber(1.234501)).toBe('1.235');
	});

	test('omit trailing zero', () => {
		expect(formatNumber(1.2304)).toBe('1.23');
	});
});
