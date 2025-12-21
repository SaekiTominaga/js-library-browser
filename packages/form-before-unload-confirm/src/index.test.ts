import { beforeAll, describe, expect, test } from '@jest/globals';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<form id="form" class="form"></form>
<span></span>
`;
});

describe('argument type', () => {
	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('form'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('form'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('form'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#form'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.form'));
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
		index(document.querySelector('span'));
	}).toThrow('Element must be a `HTMLFormElement`');
});
