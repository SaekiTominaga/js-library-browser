import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

describe('browser support CSS anchor positioning', () => {
	let consoleWarnSpy: SpiedFunction;

	beforeAll(() => {
		CSS.supports = () => false;
	});

	beforeEach(() => {
		consoleWarnSpy = jest.spyOn(console, 'warn');
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	afterAll(() => {
		CSS.supports = () => true;
	});

	test('not support', () => {
		index('');

		expect(consoleWarnSpy).toHaveBeenCalledWith('[@w0s/footnote-reference-popover] This browser does not support CSS anchor positioning.');
	});
});
