import { describe, afterEach, test, expect } from '@jest/globals';
import type { HTMLInputFileElement } from '../@types/dom.d.ts';
import InputFilePreview from './InputFilePreview.ts';

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

		const element = document.querySelector<HTMLInputFileElement>('input[type="file"]')!;

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
