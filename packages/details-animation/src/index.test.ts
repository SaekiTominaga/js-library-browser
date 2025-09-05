import { describe, beforeEach, test, expect } from '@jest/globals';
import index from './index.ts';

describe('argument type', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<details id="details" class="details">
<summary>Open</summary>
<p></p>
</details>
`,
		);
	});

	test('getElementById', () => {
		expect(index(document.getElementById('details'))).toBe(undefined);
	});

	test('getElementsByClassName', () => {
		expect(index(document.getElementsByClassName('details'))).toBe(undefined);
	});

	test('getElementsByTagName', () => {
		expect(index(document.getElementsByTagName('details'))).toBe(undefined);
	});

	test('querySelector', () => {
		expect(index(document.querySelector('#details'))).toBe(undefined);
	});

	test('querySelectorAll', () => {
		expect(index(document.querySelectorAll('.details'))).toBe(undefined);
	});

	test('null', () => {
		expect(index(document.querySelector('.foo'))).toBe(undefined);
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('p'));
		}).toThrow('Element must be a `HTMLDetailsElement`');
	});
});
