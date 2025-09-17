import { webcrypto } from 'node:crypto';
import { describe, beforeAll, afterAll, beforeEach, afterEach, test, expect } from '@jest/globals';
import Tab from './Tab.ts';

customElements.define('x-tab', Tab);

Object.defineProperty(globalThis, 'crypto', {
	value: webcrypto,
}); // `jsdom` が `crypto.randomUUID()` 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/1612

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
</x-tab>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML.replaceAll('\n', '')).toEqual(
			expect.stringMatching(
				/^<x-tab><a slot="tab" id="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" role="tab" aria-controls="tabpanel1" tabindex="0" aria-selected="true">Tab 1<\/a><a slot="tab" id="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" role="tab" aria-controls="tabpanel2" tabindex="-1" aria-selected="false">Tab 2<\/a><div slot="tabpanel" id="tabpanel1" role="tabpanel" aria-labelledby="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}">Tab panel 1<\/div><div slot="tabpanel" id="tabpanel2" role="tabpanel" aria-labelledby="[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}" class="is-hidden">Tab panel 2<\/div><\/x-tab>$/u,
			),
		);
	});

	test('disconnected', () => {
		document.querySelector('x-tab')?.remove();
	});
});

describe('attributes - get / set', () => {
	test('tablist-label', () => {
		const tab = new Tab();

		expect(tab.tablistLabel).toBeNull();
		tab.tablistLabel = 'label';
		expect(tab.tablistLabel).toBe('label');
		tab.tablistLabel = null;
		expect(tab.tablistLabel).toBeNull();
	});

	test('storage-key', () => {
		const tab = new Tab();

		expect(tab.storageKey).toBeNull();
		tab.storageKey = 'foo';
		expect(tab.storageKey).toBe('foo');
		tab.storageKey = null;
		expect(tab.storageKey).toBeNull();
	});
});

describe('tab event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
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
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<x-tab>
<a href="#tabpanel1" slot="tab">Tab 1</a>
<a href="#tabpanel2" slot="tab">Tab 2</a>
<a href="#tabpanel3" slot="tab">Tab 3</a>
<div slot="tabpanel" id="tabpanel1">Tab panel 1</div>
<div slot="tabpanel" id="tabpanel2">Tab panel 2</div>
<div slot="tabpanel" id="tabpanel3">Tab panel 3</div>
</x-tab>
`,
		);
	});
	afterEach(() => {
		document.body.innerHTML = '';
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
