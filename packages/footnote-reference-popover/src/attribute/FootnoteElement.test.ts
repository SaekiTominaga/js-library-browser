import { describe, test, expect } from '@jest/globals';
import FootnoteElement from './FootnoteElement.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(() => {
			new FootnoteElement(undefined);
		}).toThrow('The `href` attribute is not set.');
		expect(() => {
			new FootnoteElement('');
		}).toThrow('The `href` attribute is not set.');
	});

	test('invalid URL', () => {
		expect(() => {
			new FootnoteElement('/');
		}).toThrow('The value of the `href` attribute must be a URL.');
	});

	test('failure origin', () => {
		expect(() => {
			new FootnoteElement('http://example.com/');
		}).toThrow('The `href` attribute must be in the same content.');
	});

	test('no element', () => {
		expect(() => {
			new FootnoteElement('http://localhost/#xxx');
		}).toThrow('Element `#xxx` not found.');
	});
});
