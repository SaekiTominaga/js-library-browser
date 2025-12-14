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
		expect(() => {
			index(document.getElementById('footnote-reference-popover'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('footnote-reference-popover'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('a'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#footnote-reference-popover'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.footnote-reference-popover'));
		}).not.toThrow();
	});

	test('null', () => {
		expect(() => {
			index(document.querySelector('.foo'));
		}).not.toThrow();
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('p'));
		}).toThrow('Element must be a `HTMLAnchorElement`');
	});
});
