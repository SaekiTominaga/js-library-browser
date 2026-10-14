import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<button id="button" class="button" data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
</span>
`;
});

describe('browser support ariaControlsElements', () => {
	let tempariaControlsElements: readonly Element[] | null;

	let consoleInfoSpy: SpiedFunction;

	beforeAll(() => {
		tempariaControlsElements = Element.prototype.ariaControlsElements;
		// @ts-expect-error: ts(2790)
		delete Element.prototype.ariaControlsElements;
	});

	beforeEach(() => {
		consoleInfoSpy = jest.spyOn(console, 'info');
	});

	afterEach(() => {
		consoleInfoSpy.mockRestore();
	});

	afterAll(() => {
		Element.prototype.ariaControlsElements = tempariaControlsElements;
	});

	test('not support', () => {
		index(null);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support `ariaControlsElements` property.');
	});
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
		index(document.querySelector('#checkboxes'));
	}).toThrow(new Error('Element must be a `HTMLButtonElement`'));
});
