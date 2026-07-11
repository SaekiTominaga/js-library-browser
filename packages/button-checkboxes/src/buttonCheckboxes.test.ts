import { webcrypto } from 'node:crypto';
import { describe, expect, test } from '@jest/globals';
import buttonCheckboxes from './buttonCheckboxes.ts';

Object.defineProperty(globalThis, 'crypto', {
	value: webcrypto,
}); // `jsdom` が `crypto.randomUUID()` 要素をサポートするまでの暫定処理 <https://github.com/jsdom/jsdom/issues/1612>

describe('aria-controls', () => {
	test('UUID auto set', () => {
		document.body.innerHTML = `
<button data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" />
</span>
`;

		const $button = document.querySelector('button');
		const $checkboxes = document.querySelectorAll('input[type="checkbox"]');

		expect($button?.getAttribute('aria-controls')).toBeNull();
		expect($checkboxes[0]?.id).toBe('checkbox1');
		expect($checkboxes[1]?.id).toBe('');

		buttonCheckboxes($button!);

		expect($button?.getAttribute('aria-controls')).toMatch(/^checkbox1 [a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v);
		expect($checkboxes[0]?.id).toBe('checkbox1');
		expect($checkboxes[1]?.id).toMatch(/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/v);
	});

	test('already aria-controls set', () => {
		document.body.innerHTML = `
<button data-course="check" data-control="checkboxes" aria-controls="checkbox1 checkbox2"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" />
</span>
`;

		const $button = document.querySelector('button');
		const $checkboxes = document.querySelectorAll('input[type="checkbox"]');

		expect($button?.getAttribute('aria-controls')).toBe('checkbox1 checkbox2');
		expect($checkboxes[0]?.id).toBe('checkbox1');
		expect($checkboxes[1]?.id).toBe('checkbox2');

		buttonCheckboxes($button!);

		expect($button?.getAttribute('aria-controls')).toBe('checkbox1 checkbox2');
		expect($checkboxes[0]?.id).toBe('checkbox1');
		expect($checkboxes[1]?.id).toBe('checkbox2');
	});
});
