import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

describe('browser support adoptedStyleSheets', () => {
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
		index('');

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support `ariaControlsElements` property.');
	});
});
