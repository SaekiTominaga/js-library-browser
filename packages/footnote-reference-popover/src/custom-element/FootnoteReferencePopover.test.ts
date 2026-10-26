import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import FootnoteReferencePopover from './FootnoteReferencePopover.ts';

const FOOTNOTE_REFERENCE_POPOVER_ELEMENT_NAME = 'fn-ref';

beforeAll(() => {
	customElements.define(FOOTNOTE_REFERENCE_POPOVER_ELEMENT_NAME, FootnoteReferencePopover);
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
		document.createElement(FOOTNOTE_REFERENCE_POPOVER_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support CSS anchor positioning.');
	});
});
