import { beforeAll, describe, expect, test } from '@jest/globals';
import InputSwitch from './InputSwitch.ts';

beforeAll(() => {
	customElements.define('input-switch', InputSwitch);
});

describe('attributeChangedCallback', () => {
	beforeAll(() => {
		document.body.innerHTML = `<input-switch></input-switch>`;
	});

	test('value', () => {
		const $switch = document.querySelector<InputSwitch>('input-switch')!;

		expect($switch.value).toBe('on');

		$switch.value = 'foo';
		expect($switch.value).toBe('foo');

		$switch.value = null;
		expect($switch.value).toBe('on');
	});

	test('checked', () => {
		const $switch = document.querySelector<InputSwitch>('input-switch')!;

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
		const $switch = document.querySelector<InputSwitch>('input-switch')!;

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
		const $switch = document.querySelector<InputSwitch>('input-switch')!;

		expect($switch.storageKey).toBeNull();

		$switch.storageKey = 'foo';
		expect($switch.storageKey).toBe('foo');

		$switch.storageKey = null;
		expect($switch.storageKey).toBeNull();
	});
});
