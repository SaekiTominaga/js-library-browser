import { describe, beforeEach, test, expect } from '@jest/globals';
import index from './index.ts';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<a href="#footnote" class="footnote-reference-popover" id="footnote-reference-popover"></a>
<p id="footnote"></p>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('footnote-reference-popover'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('footnote-reference-popover'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('a'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#footnote-reference-popover'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.footnote-reference-popover'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('p'));
		}).toThrow('Element must be a `HTMLAnchorElement`');
	});
});
