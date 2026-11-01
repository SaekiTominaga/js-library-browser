import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import index from './index.ts';

describe('browser support CustomStateSet', () => {
	let tempCustomStateSet: CustomStateSet;
	let consoleWarnSpy: SpiedFunction;

	beforeAll(() => {
		tempCustomStateSet = ElementInternals.prototype.states;
		// @ts-expect-error: ts(2790)
		delete ElementInternals.prototype.states;
	});

	beforeEach(() => {
		consoleWarnSpy = jest.spyOn(console, 'warn');
	});

	afterEach(() => {
		consoleWarnSpy.mockRestore();
	});

	afterAll(() => {
		// @ts-expect-error: ts(2540)
		ElementInternals.prototype.states = tempCustomStateSet;
	});

	test('not support', () => {
		index('');

		expect(consoleWarnSpy).toHaveBeenCalledWith('[@w0s/input-switch] This browser does not support `CustomStateSet`.');
	});
});
