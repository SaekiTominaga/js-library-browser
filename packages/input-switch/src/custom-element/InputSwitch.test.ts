import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import InputSwitch from './InputSwitch.ts';

customElements.define('x-input-switch', InputSwitch);

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});
	test('disconnected', () => {
		document.querySelector('x-input-switch')?.remove();
	});
});

describe('attribute', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;
	});

	test('value', () => {
		const element = document.querySelector<InputSwitch>('x-input-switch')!;

		expect(element.value).toBe('on');

		element.value = 'foo';
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false" value="foo"></x-input-switch>');

		element.value = null;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});

	test('checked', () => {
		const element = document.querySelector<InputSwitch>('x-input-switch')!;

		expect(element.checked).toBeFalsy();

		element.checked = true;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="true" aria-disabled="false" checked=""></x-input-switch>');

		element.checked = false;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});

	test('disabled', () => {
		const element = document.querySelector<InputSwitch>('x-input-switch')!;

		expect(element.disabled).toBeFalsy();

		element.disabled = true;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="-1" role="switch" aria-checked="false" aria-disabled="true" disabled=""></x-input-switch>');

		element.disabled = false;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});

	test('storage-key', () => {
		const element = document.querySelector<InputSwitch>('x-input-switch')!;

		expect(element.storageKey).toBeNull();

		element.storageKey = 'foo';
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false" storage-key="foo"></x-input-switch>');

		element.storageKey = null;
		expect(element.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});
});

describe('event', () => {
	beforeEach(() => {
		document.body.innerHTML = `<x-input-switch></x-input-switch>`;
	});

	test('change', () => {
		const element = document.querySelector('x-input-switch');

		element?.dispatchEvent(new Event('change'));

		expect(element?.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="true" aria-disabled="false" checked=""></x-input-switch>');
	});

	test('click', () => {
		const element = document.querySelector('x-input-switch');

		element?.dispatchEvent(new MouseEvent('click'));

		expect(element?.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="true" aria-disabled="false" checked=""></x-input-switch>');
	});

	test('keydown - enter', () => {
		const element = document.querySelector('x-input-switch');

		element?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

		expect(element?.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="false" aria-disabled="false"></x-input-switch>');
	});

	test('keydown - space', () => {
		const element = document.querySelector('x-input-switch');

		element?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

		expect(element?.outerHTML).toBe('<x-input-switch tabindex="0" role="switch" aria-checked="true" aria-disabled="false" checked=""></x-input-switch>');
	});
});
