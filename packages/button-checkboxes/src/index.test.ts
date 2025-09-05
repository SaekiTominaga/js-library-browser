import { describe, beforeEach, test, expect } from '@jest/globals';
import index from './index.ts';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button id="button" class="button" data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('button'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('button'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('button'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#button'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.button'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('#checkboxes'));
		}).toThrow('Element must be a `HTMLButtonElement`');
	});
});
