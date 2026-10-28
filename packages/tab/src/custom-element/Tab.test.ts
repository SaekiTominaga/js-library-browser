import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import Tab from './Tab.ts';

const TAB_ELEMENT_NAME = 'x-tab';

beforeAll(() => {
	customElements.define(TAB_ELEMENT_NAME, Tab);
});

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
		document.createElement(TAB_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support `ariaControlsElements` property.');
	});
});

describe('connectedCallback', () => {
	describe('storage', () => {
		let consoleInfoSpy: SpiedFunction;

		beforeEach(() => {
			consoleInfoSpy = jest.spyOn(console, 'info');
		});

		afterEach(() => {
			sessionStorage.clear();
			consoleInfoSpy.mockRestore();
		});

		test('no exist id', () => {
			sessionStorage.setItem('x', 'foo');

			document.body.innerHTML = `<x-tab storage-key="x"></x-tab>`;

			expect(consoleInfoSpy).toHaveBeenCalledWith('Element `#foo` not found.');
		});
	});
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-tab></x-tab>`;
	});

	test('tablist-label', () => {
		const $tab = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;
		const $tablist = $tab.shadowRoot?.querySelector<HTMLElement>('[part~="tablist"]');

		expect($tab.tablistLabel).toBeNull();
		expect($tablist?.ariaLabel).toBeNull();

		$tab.tablistLabel = 'label';
		expect($tab.tablistLabel).toBe('label');
		expect($tablist?.ariaLabel).toBe('label');

		$tab.tablistLabel = null;
		expect($tab.tablistLabel).toBeNull();
		expect($tablist?.ariaLabel).toBeNull();
	});

	test('storage-key', () => {
		const $tab = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;

		expect($tab.storageKey).toBeNull();

		$tab.storageKey = 'foo';
		expect($tab.storageKey).toBe('foo');

		$tab.storageKey = null;
		expect($tab.storageKey).toBeNull();
	});
});
