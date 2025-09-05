import { describe, afterEach, test, expect } from '@jest/globals';
import Overlay from './Overlay.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Overlay(undefined);
		}).toThrow('The `data-overlayed-by` attribute is not set.');
	});

	test('no element', () => {
		expect(() => {
			new Overlay('xxx');
		}).toThrow('Element `#xxx` not found.');
	});

	test('not dialog', () => {
		document.body.insertAdjacentHTML('beforeend', '<p id="dialog"></p>');

		expect(() => {
			new Overlay('dialog');
		}).toThrow('Element `#dialog` must be a `<dialog>` element.');
	});

	test('exist element', () => {
		document.body.insertAdjacentHTML('beforeend', '<dialog id="dialog"></dialog>');

		const { element } = new Overlay('dialog');

		expect(element.id).toBe('dialog');
	});
});
