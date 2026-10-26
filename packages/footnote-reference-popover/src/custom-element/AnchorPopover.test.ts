import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import AnchorPopover from './AnchorPopover.ts';

const ANCHOR_POPOVER_ELEMENT_NAME = 'fn-ref';

beforeAll(() => {
	customElements.define(ANCHOR_POPOVER_ELEMENT_NAME, AnchorPopover);
});

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
		document.createElement(ANCHOR_POPOVER_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support CSS anchor positioning.');
	});
});
