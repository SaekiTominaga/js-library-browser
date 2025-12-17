import { webcrypto } from 'node:crypto';
import { describe, expect, test } from '@jest/globals';
import buttonCheckboxes from './buttonCheckboxes.ts';

Object.defineProperty(globalThis, 'crypto', {
	value: webcrypto,
}); // `jsdom` が `crypto.randomUUID()` 要素をサポートするまでの暫定処理 <https://github.com/jsdom/jsdom/issues/1612>

test('click event', () => {
	document.body.innerHTML = `
<button data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
</span>
`;

	const buttonElement = document.querySelector('button')!;

	buttonCheckboxes(buttonElement);

	buttonElement.dispatchEvent(new MouseEvent('click'));

	expect([...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].every((element) => element.checked)).toBeTruthy();
});

describe('aria-controls', () => {
	test('already aria-controls set', () => {
		document.body.innerHTML = `
<button data-course="check" data-control="checkboxes" aria-controls="checkbox1 checkbox2"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" checked="" />
</span>
`;

		buttonCheckboxes(document.querySelector('button')!);

		expect(document.querySelector('button')?.getAttribute('aria-controls')).toBe('checkbox1 checkbox2');

		const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
		expect(checkboxes[0]?.id).toBe('checkbox1');
		expect(checkboxes[1]?.id).toBe('checkbox2');
	});

	test('already id set', () => {
		document.body.innerHTML = `
<button data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" id="checkbox1" />
<input type="checkbox" id="checkbox2" checked="" />
</span>
`;

		buttonCheckboxes(document.querySelector('button')!);

		expect(document.querySelector('button')?.getAttribute('aria-controls')).toBe('checkbox1 checkbox2');

		const checkboxes = [...document.querySelectorAll('input[type="checkbox"]')];
		expect(checkboxes[0]?.id).toBe('checkbox1');
		expect(checkboxes[1]?.id).toBe('checkbox2');
	});

	test('UUID auto set', () => {
		document.body.innerHTML = `
<button data-course="check" data-control="checkboxes"></button>

<span id="checkboxes">
<input type="checkbox" />
<input type="checkbox" checked="" />
</span>
`;

		buttonCheckboxes(document.querySelector('button')!);

		expect(document.querySelector('button')?.getAttribute('aria-controls')?.length).toBe(36 * 2 + 1);
		expect([...document.querySelectorAll('input[type="checkbox"]')].every((element) => element.id.length === 36)).toBeTruthy();
	});
});
