import { describe, expect, test } from '@jest/globals';
import { getFootnote } from './utility.ts';

describe('getFootnote', () => {
	test('no element', () => {
		document.body.innerHTML = ``;

		expect(() => {
			getFootnote(document.querySelector('a'));
		}).toThrow(new Error('Anchor element not found'));
	});

	test('mismatch element name', () => {
		document.body.innerHTML = `<p></p>`;

		expect(() => {
			getFootnote(document.querySelector('p'));
		}).toThrow(new TypeError('The element must be a `<a>` element'));
	});

	test('no href', () => {
		document.body.innerHTML = `<a></a>`;

		expect(() => {
			getFootnote(document.querySelector('a'));
		}).toThrow(new TypeError('The `href` attribute is not set'));
	});

	test('external URL', () => {
		document.body.innerHTML = `<a href="http://example.com/"></a>`;

		expect(() => {
			getFootnote(document.querySelector('a'));
		}).toThrow(new TypeError('The `href` attribute must be in the same content'));
	});

	test('not same path', () => {
		document.body.innerHTML = `<a href="foo"></a>`;

		expect(() => {
			getFootnote(document.querySelector('a'));
		}).toThrow(new TypeError('The `href` attribute must be in the same content'));
	});

	test('no footnote', () => {
		document.body.innerHTML = `<a href="#foo"></a>`;

		expect(() => {
			getFootnote(document.querySelector('a'));
		}).toThrow(new Error('Element `#foo` not found'));
	});

	test('success get footnote', () => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote">Footnote</p>
		`;

		expect(getFootnote(document.querySelector('a')).innerHTML).toBe('Footnote');
	});

	test('ignore', () => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote">Footnote <span class="ignore">ignore</span> <span>text</span></p>
		`;

		expect(getFootnote(document.querySelector('a'), { ignoreSelectors: '.ignore' }).innerHTML).toBe('Footnote  <span>text</span>');
	});
});
