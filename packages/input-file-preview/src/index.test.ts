import { beforeAll, describe, expect, test } from '@jest/globals';
import index from './index.ts';

describe('argument type', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<input type="file" id="input" class="input" data-preview="preview" />
<template id="preview">
<output>foo</output>
</template>
`;
	});

	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('input'));
		}).not.toThrow();
	});

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

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('template'));
		}).toThrow('Element must be a `HTMLInputElement`');
	});
});

describe('type attribute', () => {
	beforeAll(() => {
		document.body.innerHTML = '<input type="foo" />';
	});

	test('type mismatch', () => {
		expect(() => {
			index(document.querySelector('input'));
		}).toThrow('Element must be a `<input type=file>`');
	});
});
