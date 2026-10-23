import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

describe('browser support CSS anchor positioning', () => {
	let consoleInfoSpy: SpiedFunction;

	beforeAll(() => {
		CSS.supports = () => false;
	});

	beforeEach(() => {
		consoleInfoSpy = jest.spyOn(console, 'info');
	});

	afterEach(() => {
		consoleInfoSpy.mockRestore();
	});

	afterAll(() => {
		CSS.supports = () => true;
	});

	test('not support', () => {
		index(null);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support CSS anchor positioning.');
	});
});

describe('argument type', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote" class="footnote-reference-popover" id="footnote-reference-popover"></a>
<p id="footnote"></p>
`;
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
});

test('type mismatch', () => {
	expect(() => {
		index(document.createElement('p'));
	}).toThrow(new Error('Element must be a `HTMLAnchorElement`'));
});
