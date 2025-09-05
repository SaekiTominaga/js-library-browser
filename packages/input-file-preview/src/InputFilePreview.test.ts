import { describe, afterEach, test, expect } from '@jest/globals';
import InputFilePreview from './InputFilePreview.ts';

describe('HTML', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('not file', () => {
		document.body.insertAdjacentHTML('beforeend', '<input />');

		expect(() => {
			new InputFilePreview(document.querySelector('input')!);
		}).toThrow('Not a `<input type=file>`.');
	});
});

describe('change', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('success', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<input type="file" data-preview="preview" />
<template id="preview">
<output>foo</output>
</template>
`,
		);

		const element = document.querySelector('input')!;

		new InputFilePreview(element);

		element.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(`
<input type="file" data-preview="preview">
<template id="preview">
<output>foo</output>
</template>
`);
	});
});
