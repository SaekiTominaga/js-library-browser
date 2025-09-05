import { describe, afterEach, test, expect } from '@jest/globals';
import Preview from './Preview.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Preview(undefined);
		}).toThrow('The `data-preview` attribute is not set.');
	});

	test('no element', () => {
		expect(() => {
			new Preview('xxx');
		}).toThrow('Element `#xxx` not found.');
	});

	test('no template', () => {
		document.body.insertAdjacentHTML('beforeend', '<p id="template"></p>');

		expect(() => {
			new Preview('template');
		}).toThrow('Element `#template` must be a `<template>` element.');
	});

	test('no exist output', () => {
		document.body.insertAdjacentHTML('beforeend', '<template id="template"></template>');

		expect(() => {
			new Preview('template');
		}).toThrow('There must be one `<output>` element within the `<template>` element.');
	});

	test('exist output', () => {
		document.body.insertAdjacentHTML('beforeend', '<template id="template"><output><strong>message</strong></output></template>');

		const { template, outputHtml } = new Preview('template');

		expect(template.id).toBe('template');
		expect(outputHtml).toBe('<strong>message</strong>');
	});
});
