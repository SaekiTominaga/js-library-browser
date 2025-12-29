import { webcrypto } from 'node:crypto';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import Tab from './Tab.ts';

const TAB_ELEMENT_NAME = 'x-tab';

beforeAll(() => {
	Object.defineProperty(globalThis, 'crypto', {
		value: webcrypto,
	}); // `jsdom` が `crypto.randomUUID()` 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/1612

	customElements.define(TAB_ELEMENT_NAME, Tab);
});

describe('browser setting storage', () => {
	let tempSessionStorage: Storage;

	beforeAll(() => {
		tempSessionStorage = sessionStorage;
		// @ts-expect-error: ts(2790)
		delete window.sessionStorage;
	});
	afterAll(() => {
		window.sessionStorage = tempSessionStorage;
	});

	test('block', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		document.createElement(TAB_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('Storage access blocked.');

		consoleInfoSpy.mockRestore();
	});
});

describe('connectedCallback', () => {
	test('HTML', () => {
		document.body.innerHTML = `
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`;

		const tabElement = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;

		expect(tabElement.outerHTML.replaceAll('\n', '')).toEqual(
			expect.stringMatching(
				/^<x-tab><a slot="tab" id="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true">Tab 1<\/a><a slot="tab" id="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false">Tab 2<\/a><div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}">Tab panel 1<\/div><div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" class="is-hidden">Tab panel 2<\/div><\/x-tab>$/u,
			),
		);
	});

	test('`tablist-label` attribute', () => {
		document.body.innerHTML = `<x-tab tablist-label="label"></x-tab>`;

		const tabElement = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;
		const tablistElement = tabElement.shadowRoot?.querySelector<HTMLElement>('[part=tablist]');

		expect(tablistElement?.getAttribute('aria-label')).toBe('label');
	});

	describe('storage', () => {
		afterEach(() => {
			sessionStorage.clear();
		});

		test('select tab', () => {
			sessionStorage.setItem('x', 'tabpanel2');

			document.body.innerHTML = `
<x-tab storage-key="x">
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`;

			expect(document.querySelector('[slot=tab][aria-controls=tabpanel1]')?.getAttribute('aria-selected')).toBe('false');
			expect(document.querySelector('[slot=tab][aria-controls=tabpanel2]')?.getAttribute('aria-selected')).toBe('true');
			expect(document.querySelector('#tabpanel1')?.classList.contains('is-hidden')).toBeTruthy();
			expect(document.querySelector('#tabpanel2')?.classList.contains('is-hidden')).toBeFalsy();
		});

		test('no exist id', () => {
			const consoleInfoSpy = jest.spyOn(console, 'info');

			sessionStorage.setItem('x', 'foo');

			document.body.innerHTML = `<x-tab storage-key="x"></x-tab>`;

			expect(consoleInfoSpy).toHaveBeenCalledWith('Element `#foo` not found.');

			consoleInfoSpy.mockRestore();
		});
	});
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-tab></x-tab>`;
	});

	test('tablist-label', () => {
		const tabElement = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;
		const tablistElement = tabElement.shadowRoot?.querySelector<HTMLElement>('[part=tablist]');

		expect(tabElement.tablistLabel).toBeNull();
		expect(tablistElement?.getAttribute('aria-label')).toBeNull();

		tabElement.tablistLabel = 'label';
		expect(tabElement.tablistLabel).toBe('label');
		expect(tablistElement?.getAttribute('aria-label')).toBe('label');

		tabElement.tablistLabel = null;
		expect(tabElement.tablistLabel).toBeNull();
		expect(tablistElement?.getAttribute('aria-label')).toBeNull();
	});

	test('storage-key', () => {
		const tabElement = document.querySelector<Tab>(TAB_ELEMENT_NAME)!;

		expect(tabElement.storageKey).toBeNull();

		tabElement.storageKey = 'foo';
		expect(tabElement.storageKey).toBe('foo');

		tabElement.storageKey = null;
		expect(tabElement.storageKey).toBeNull();
	});
});

describe('tab event', () => {
	beforeEach(() => {
		document.body.innerHTML = `
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`;
	});

	test('click', () => {
		document.querySelector('[role="tab"][aria-controls="tabpanel2"]')?.dispatchEvent(new MouseEvent('click'));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(-1);
		expect(tabs.at(1)?.tabIndex).toBe(0);
		expect(tabs.at(2)?.tabIndex).toBe(-1);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('true');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('false');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeFalsy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeTruthy();
	});

	test('keydown ←', () => {
		document.querySelector('[role="tab"][aria-controls="tabpanel1"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(-1);
		expect(tabs.at(1)?.tabIndex).toBe(-1);
		expect(tabs.at(2)?.tabIndex).toBe(0);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('true');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeFalsy();
	});

	test('keydown →', () => {
		document.querySelector('[role="tab"][aria-controls="tabpanel1"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(-1);
		expect(tabs.at(1)?.tabIndex).toBe(0);
		expect(tabs.at(2)?.tabIndex).toBe(-1);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('true');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('false');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeFalsy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeTruthy();
	});

	test('keydown End', () => {
		document.querySelector('[role="tab"][aria-controls="tabpanel1"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(-1);
		expect(tabs.at(1)?.tabIndex).toBe(-1);
		expect(tabs.at(2)?.tabIndex).toBe(0);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('true');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeFalsy();
	});

	test('keydown Home', () => {
		document.querySelector('[role="tab"][aria-controls="tabpanel1"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
		document.querySelector('[role="tab"][aria-controls="tabpanel2"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(0);
		expect(tabs.at(1)?.tabIndex).toBe(-1);
		expect(tabs.at(2)?.tabIndex).toBe(-1);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('true');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('false');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeFalsy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeTruthy();
	});
});

describe('tabpanel event', () => {
	beforeEach(() => {
		document.body.innerHTML = `
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`;
	});

	test('keydown ←', () => {
		document.querySelector('#tabpanel1')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', ctrlKey: true }));

		const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"]'));
		expect(tabs.at(0)?.tabIndex).toBe(0);
		expect(tabs.at(1)?.tabIndex).toBe(-1);
		expect(tabs.at(2)?.tabIndex).toBe(-1);
		expect(tabs.at(0)?.getAttribute('aria-selected')).toBe('true');
		expect(tabs.at(1)?.getAttribute('aria-selected')).toBe('false');
		expect(tabs.at(2)?.getAttribute('aria-selected')).toBe('false');

		const tabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
		expect(tabpanels.at(0)?.classList.contains('is-hidden')).toBeFalsy();
		expect(tabpanels.at(1)?.classList.contains('is-hidden')).toBeTruthy();
		expect(tabpanels.at(2)?.classList.contains('is-hidden')).toBeTruthy();
	});
});
