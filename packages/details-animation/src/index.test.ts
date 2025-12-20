import { beforeAll, describe, expect, test } from '@jest/globals';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<details id="details" class="details">
<summary>Open</summary>
<p></p>
</details>
`;
});

describe('argument type', () => {
	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('details'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('details'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('details'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#details'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.details'));
		}).not.toThrow();
	});

	test('null', () => {
		expect(() => {
			index(document.querySelector('.foo'));
		}).not.toThrow();
	});
});

test('type mismatch', () => {
	expect(() => {
		index(document.querySelector('p'));
	}).toThrow('Element must be a `HTMLDetailsElement`');
});
