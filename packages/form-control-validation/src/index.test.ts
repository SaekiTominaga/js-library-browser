import { beforeAll, describe, expect, test } from '@jest/globals';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<input id="input" class="input" aria-errormessage="message">
<p id="message"></p>
`;
});

describe('argument type', () => {
	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('input'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('input'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#input'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.input'));
		}).not.toThrow();
	});

	test('null', () => {
		expect(() => {
			index(document.querySelector('.foo'));
		}).not.toThrow();
	});
});
