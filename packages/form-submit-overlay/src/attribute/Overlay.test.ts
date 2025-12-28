import { expect, test } from '@jest/globals';
import Overlay from './Overlay.ts';

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
	document.body.innerHTML = `<p id="dialog"></p>`;

	expect(() => {
		new Overlay('dialog');
	}).toThrow('Element `#dialog` must be a `<dialog>` element.');
});

test('exist element', () => {
	document.body.innerHTML = `<dialog id="dialog"></dialog>`;

	const { element } = new Overlay('dialog');

	expect(element.id).toBe('dialog');
});
