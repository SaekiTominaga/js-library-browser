import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

beforeAll(() => {
	document.body.innerHTML = `
<input id="input" class="input" aria-errormessage="message">
<p id="message"></p>
`;
});

describe('browser support ariaLabelledByElements', () => {
	let tempAriaLabelledByElements: readonly Element[] | null;

	let consoleWarnSpy: SpiedFunction;

	beforeAll(() => {
		tempAriaLabelledByElements = Element.prototype.ariaLabelledByElements;
		// @ts-expect-error: ts(2790)
		delete Element.prototype.ariaLabelledByElements;
	});

	beforeEach(() => {
		consoleWarnSpy = jest.spyOn(console, 'warn');
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	afterAll(() => {
		Element.prototype.ariaLabelledByElements = tempAriaLabelledByElements;
	});

	test('not support', () => {
		index(null);

		expect(consoleWarnSpy).toHaveBeenCalledWith('[@w0s/form-control-validation] This browser does not support `ariaLabelledByElements` property.');
	});
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
