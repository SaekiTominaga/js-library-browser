import { describe, beforeEach, test, expect } from '@jest/globals';
import index from './index.ts';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<textarea id="textarea" class="textarea"></textarea>
<span></span>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('textarea'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('textarea'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('textarea'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#textarea'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.textarea'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('span'));
		}).toThrow('Element must be a `HTMLTextAreaElement`');
	});
});
