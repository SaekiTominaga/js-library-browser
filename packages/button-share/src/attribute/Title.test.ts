import { describe, test, expect } from '@jest/globals';
import Title from './Title.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Title(undefined).text).toBeUndefined();
	});

	test('text', () => {
		expect(new Title('text').text).toBe('text');
	});
});
