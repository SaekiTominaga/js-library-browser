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
		index('');

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support CSS anchor positioning.');
	});
});
