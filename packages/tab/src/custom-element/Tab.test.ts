import { afterAll, afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals';
import Tab from './Tab.ts';

const TAB_ELEMENT_NAME = 'x-tab';

beforeAll(() => {
	customElements.define(TAB_ELEMENT_NAME, Tab);
});

describe('browser support adoptedStyleSheets', () => {
	let tempAdoptedStyleSheets: CSSStyleSheet[];

	beforeAll(() => {
		tempAdoptedStyleSheets = ShadowRoot.prototype.adoptedStyleSheets;
		// @ts-expect-error: ts(2790)
		delete ShadowRoot.prototype.adoptedStyleSheets;
	});

	afterAll(() => {
		ShadowRoot.prototype.adoptedStyleSheets = tempAdoptedStyleSheets;
	});

	test('not support', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		document.createElement(TAB_ELEMENT_NAME);

		consoleInfoSpy.mockRestore();

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support ShadowRoot: `adoptedStyleSheets`.');
	});
});

describe('connectedCallback', () => {
	describe('storage', () => {
		afterEach(() => {
			sessionStorage.clear();
		});

		test('no exist id', () => {
			const consoleInfoSpy = jest.spyOn(console, 'info');

			sessionStorage.setItem('x', 'foo');

			document.body.innerHTML = `<x-tab storage-key="x"></x-tab>`;

			consoleInfoSpy.mockRestore();

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
		const $tablist = $tab.shadowRoot?.querySelector<HTMLElement>('[part=tablist]');

		expect($tab.tablistLabel).toBeNull();
		expect($tablist?.getAttribute('aria-label')).toBeNull();

		$tab.tablistLabel = 'label';
		expect($tab.tablistLabel).toBe('label');
		expect($tablist?.getAttribute('aria-label')).toBe('label');

		$tab.tablistLabel = null;
		expect($tab.tablistLabel).toBeNull();
		expect($tablist?.getAttribute('aria-label')).toBeNull();
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
