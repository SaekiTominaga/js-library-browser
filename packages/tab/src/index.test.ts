import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

describe('browser support adoptedStyleSheets', () => {
	let tempariaControlsElements: readonly Element[] | null;

	let consoleWarnSpy: SpiedFunction;

	beforeAll(() => {
		tempariaControlsElements = Element.prototype.ariaControlsElements;
		// @ts-expect-error: ts(2790)
		delete Element.prototype.ariaControlsElements;
	});

	beforeEach(() => {
		consoleWarnSpy = jest.spyOn(console, 'warn');
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	afterAll(() => {
		Element.prototype.ariaControlsElements = tempariaControlsElements;
	});

	test('not support', () => {
		index('');

		expect(consoleWarnSpy).toHaveBeenCalledWith('[@w0s/tab] This browser does not support `ariaControlsElements` property.');
	});
});
