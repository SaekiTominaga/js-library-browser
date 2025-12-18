import { describe, expect, test } from '@jest/globals';
import Data from './Data.ts';

test('no attribute', () => {
	expect(() => {
		new Data({});
	}).toThrow('The `data-text` or `data-target` attribute is not set.');
});

test('text', () => {
	expect(new Data({ text: 'Text' }).text).toBe('Text');
});

describe('target', () => {
	test('no element', () => {
		expect(() => {
			new Data({ target: 'xxx' });
		}).toThrow('Element `#xxx` not found.');
	});

	test('exist element', () => {
		document.body.innerHTML = `<p id="target">Text</p>`;

		expect(new Data({ target: 'target' }).element?.textContent).toBe('Text');
	});
});
