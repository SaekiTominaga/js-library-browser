import { beforeAll, describe, expect, test } from '@jest/globals';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<button id="button" class="button" data-target="target">Copy</button>
<p id="target">Text</p>
`;
});

describe('argument type', () => {
	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('button'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('button'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('button'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#button'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.button'));
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
		index(document.querySelector('#target'));
	}).toThrow('Element must be a `HTMLButtonElement`');
});
