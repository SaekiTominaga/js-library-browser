import { describe, expect, test } from '@jest/globals';
import { getParentPage } from './url.ts';

describe('getParentPage()', () => {
	test('slash end', () => {
		expect(getParentPage(new URL('http://example.com/path/to/')).toString()).toBe('http://example.com/path/');
	});

	test('no slash end', () => {
		expect(getParentPage(new URL('http://example.com/path/to')).toString()).toBe('http://example.com/path/');
	});

	test('top page', () => {
		expect(getParentPage(new URL('http://example.com/')).toString()).toBe('http://example.com/');
	});
});
