import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import Tab from './Tab.ts';

beforeAll(() => {
	customElements.define('my-tab', Tab);
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

			document.body.innerHTML = `<my-tab storage-key="x"></my-tab>`;

			expect(consoleInfoSpy).toHaveBeenCalledWith('Element `#foo` not found.');
		});
	});
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<my-tab></my-tab>`;
	});

	test('tablist-label', () => {
		const $tab = document.querySelector<Tab>('my-tab')!;
		const $tablist = $tab.shadowRoot?.querySelector<HTMLElement>('[part=tablist]');

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
		const $tab = document.querySelector<Tab>('my-tab')!;

		expect($tab.storageKey).toBeNull();

		$tab.storageKey = 'foo';
		expect($tab.storageKey).toBe('foo');

		$tab.storageKey = null;
		expect($tab.storageKey).toBeNull();
	});
});
