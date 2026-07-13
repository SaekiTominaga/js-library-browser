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

			const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

			expect($switch.checked).toBeTruthy();
		});

		test('not checked last time', () => {
			localStorage.setItem('x', 'false');

			document.body.innerHTML = `<x-input-switch checked="" storage-key="x"></x-input-switch>`;

			const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

			expect($switch.checked).toBeFalsy();
		});
	});

	test('HTML', () => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;

		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;
	});

	test('value', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.value).toBe('on');

		$switch.value = 'foo';
		expect($switch.value).toBe('foo');

		$switch.value = null;
		expect($switch.value).toBe('on');
	});

	test('checked', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.checked).toBeFalsy();
		expect($switch.getAttribute('aria-checked')).toBe('false');

		$switch.checked = true;
		expect($switch.checked).toBeTruthy();
		expect($switch.getAttribute('aria-checked')).toBe('true');

		$switch.checked = false;
		expect($switch.checked).toBeFalsy();
		expect($switch.getAttribute('aria-checked')).toBe('false');
	});

	test('disabled', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.disabled).toBeFalsy();
		expect($switch.getAttribute('aria-disabled')).toBe('false');

		$switch.disabled = true;
		expect($switch.disabled).toBeTruthy();
		expect($switch.getAttribute('aria-disabled')).toBe('true');

		$switch.disabled = false;
		expect($switch.disabled).toBeFalsy();
		expect($switch.getAttribute('aria-disabled')).toBe('false');
	});

	test('storage-key', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.storageKey).toBeNull();

		$switch.storageKey = 'foo';
		expect($switch.storageKey).toBe('foo');

		$switch.storageKey = null;
		expect($switch.storageKey).toBeNull();
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
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.checked).toBeFalsy();
		expect(localStorage.getItem('x')).toBeNull();

		$switch.dispatchEvent(new Event('change'));

		expect($switch.checked).toBeTruthy();
		expect(localStorage.getItem('x')).toBe('true');
	});

	test('click', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.checked).toBeFalsy();

		$switch.dispatchEvent(new MouseEvent('click'));

		expect($switch.checked).toBeTruthy();
	});

	test('space key', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.checked).toBeFalsy();

		$switch.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

		expect($switch.checked).toBeTruthy();
	});

	test('enter key', () => {
		const $switch = document.querySelector<InputSwitch>(INPUT_SWITCH_ELEMENT_NAME)!;

		expect($switch.checked).toBeFalsy();

		$switch.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

		expect($switch.checked).toBeFalsy(); // Enter キーでは変わらない
	});
});
