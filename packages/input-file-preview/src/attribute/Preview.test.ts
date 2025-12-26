import { describe, expect, test } from '@jest/globals';
import Preview from './Preview.ts';

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
	document.body.innerHTML = `<p id="template"></p>`;

	expect(() => {
		new Preview('template');
	}).toThrow('Element `#template` must be a `<template>` element.');
});

describe('template content', () => {
	test('text node', () => {
		document.body.innerHTML = `<template id="template"><output></output>text</template>`;

		expect(() => {
			new Preview('template');
		}).toThrow('There must be only Element node, comment node, or empty text node within the `<template>` element.');
	});

	test('empty', () => {
		document.body.innerHTML = `<template id="template"></template>`;

		expect(() => {
			new Preview('template');
		}).toThrow('There must be one `<output>` element within the `<template>` element.');
	});

	test('no <output> element', () => {
		document.body.innerHTML = `<template id="template"><p></p></template>`;

		expect(() => {
			new Preview('template');
		}).toThrow('There must be one `<output>` element within the `<template>` element.');
	});

	test('exist <output>', () => {
		document.body.innerHTML = `<template id="template"> <p><output><strong>message</strong></output></p><p>text</p><!-- comment --></template>`;

		const { template, outputHtml } = new Preview('template');

		expect(template.id).toBe('template');
		expect(outputHtml).toBe('<strong>message</strong>');
	});
});
