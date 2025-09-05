import { describe, test, expect } from '@jest/globals';
import Title from './Title.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(new Title(undefined).value).toBeUndefined();
	});

	test('valid', () => {
		expect(new Title('text').value).toBe('text');
	});
});
