import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
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

		consoleInfoSpy.mockRestore();

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support ShadowRoot: `adoptedStyleSheets`.');
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
