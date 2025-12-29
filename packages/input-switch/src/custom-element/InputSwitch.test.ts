import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import InputSwitch from './InputSwitch.ts';

const INPUT_SWITCH_ELEMENT_NAME = 'x-input-switch';

beforeAll(() => {
	customElements.define(INPUT_SWITCH_ELEMENT_NAME, InputSwitch);
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

		document.createElement(INPUT_SWITCH_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support ShadowRoot: `adoptedStyleSheets`.');

		consoleInfoSpy.mockRestore();
	});
});

describe('browser setting storage', () => {
	let tempLocalStorage: Storage;

	beforeAll(() => {
		tempLocalStorage = localStorage;
		// @ts-expect-error: ts(2790)
		delete window.localStorage;
	});
	afterAll(() => {
		window.localStorage = tempLocalStorage;
	});

	test('block', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		document.createElement(INPUT_SWITCH_ELEMENT_NAME);

		expect(consoleInfoSpy).toHaveBeenCalledWith('Storage access blocked.');

		consoleInfoSpy.mockRestore();
	});
});

describe('connectedCallback', () => {
	describe('storage', () => {
		afterEach(() => {
			localStorage.clear();
		});

		test('checked last time', () => {
			localStorage.setItem('x', 'true');

			document.body.innerHTML = `<x-input-switch storage-key="x"></x-input-switch>`;

			const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

			expect(switchElement.checked).toBeTruthy();
		});

		test('not checked last time', () => {
			localStorage.setItem('x', 'false');

			document.body.innerHTML = `<x-input-switch checked="" storage-key="x"></x-input-switch>`;

			const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

			expect(switchElement.checked).toBeFalsy();
		});
	});

	test('HTML', () => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;

		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;
	});

	test('value', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.value).toBe('on');

		switchElement.value = 'foo';
		expect(switchElement.value).toBe('foo');

		switchElement.value = null;
		expect(switchElement.value).toBe('on');
	});

	test('checked', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.checked).toBeFalsy();
		expect(switchElement.getAttribute('aria-checked')).toBe('false');

		switchElement.checked = true;
		expect(switchElement.checked).toBeTruthy();
		expect(switchElement.getAttribute('aria-checked')).toBe('true');

		switchElement.checked = false;
		expect(switchElement.checked).toBeFalsy();
		expect(switchElement.getAttribute('aria-checked')).toBe('false');
	});

	test('disabled', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.disabled).toBeFalsy();
		expect(switchElement.getAttribute('aria-disabled')).toBe('false');

		switchElement.disabled = true;
		expect(switchElement.disabled).toBeTruthy();
		expect(switchElement.getAttribute('aria-disabled')).toBe('true');

		switchElement.disabled = false;
		expect(switchElement.disabled).toBeFalsy();
		expect(switchElement.getAttribute('aria-disabled')).toBe('false');
	});

	test('storage-key', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.storageKey).toBeNull();

		switchElement.storageKey = 'foo';
		expect(switchElement.storageKey).toBe('foo');

		switchElement.storageKey = null;
		expect(switchElement.storageKey).toBeNull();
	});
});

describe('event', () => {
	beforeEach(() => {
		document.body.innerHTML = `<x-input-switch storage-key="x"></x-input-switch>`;
	});
	afterEach(() => {
		localStorage.clear();
	});

	test('change', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.checked).toBeFalsy();
		expect(localStorage.getItem('x')).toBeNull();

		switchElement.dispatchEvent(new Event('change'));

		expect(switchElement.checked).toBeTruthy();
		expect(localStorage.getItem('x')).toBe('true');
	});

	test('click', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.checked).toBeFalsy();

		switchElement.dispatchEvent(new MouseEvent('click'));

		expect(switchElement.checked).toBeTruthy();
	});

	test('space key', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.checked).toBeFalsy();

		switchElement.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

		expect(switchElement.checked).toBeTruthy();
	});

	test('enter key', () => {
		const switchElement = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect(switchElement.checked).toBeFalsy();

		switchElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

		expect(switchElement.checked).toBeFalsy(); // Enter キーでは変わらない
	});
});
