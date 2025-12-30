import { describe, expect, test } from '@jest/globals';
import { getAncestorUrls, getParentUrl } from './url.ts';

describe('getParentPage()', () => {
	test('slash end', () => {
		expect(getParentUrl(new URL('http://example.com/path/to/'))?.toString()).toBe('http://example.com/path/');
	});

	test('no slash end', () => {
		expect(getParentUrl(new URL('http://example.com/path/to'))?.toString()).toBe('http://example.com/path/');
	});

	test('query', () => {
		expect(getParentUrl(new URL('http://example.com/path/to?foo=bar'))?.toString()).toBe('http://example.com/path/');
	});

	test('hash', () => {
		expect(getParentUrl(new URL('http://example.com/path/to#foo'))?.toString()).toBe('http://example.com/path/');
	});

	test('top page', () => {
		expect(getParentUrl(new URL('http://example.com/'))).toBeUndefined();
	});
});

describe('getAncestorUrls()', () => {
	test('slash end', () => {
		const ancestorUrls = getAncestorUrls(new URL('http://example.com/path/to/'));

		expect(ancestorUrls.length).toBe(2);
		expect(ancestorUrls.at(0)?.toString()).toBe('http://example.com/path/');
		expect(ancestorUrls.at(1)?.toString()).toBe('http://example.com/');
	});

	test('no slash end', () => {
		const ancestorUrls = getAncestorUrls(new URL('http://example.com/path/to'));

		expect(ancestorUrls.length).toBe(2);
		expect(ancestorUrls.at(0)?.toString()).toBe('http://example.com/path/');
		expect(ancestorUrls.at(1)?.toString()).toBe('http://example.com/');
	});

	test('top page', () => {
		const ancestorUrls = getAncestorUrls(new URL('http://example.com/'));

		expect(ancestorUrls.length).toBe(0);
	});
});
