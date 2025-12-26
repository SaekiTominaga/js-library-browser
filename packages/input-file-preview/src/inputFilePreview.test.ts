import { beforeAll, describe, expect, test } from '@jest/globals';
import type { HTMLInputFileElement } from '../@types/lib.dom.ts';
import inputFilePreview from './inputFilePreview.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<input type="file" data-preview="preview">
<template id="preview">
<output>foo</output>
</template>
`;
	});

	test('change', () => {
		const initBodyHTML = document.body.innerHTML;
		const inputElement = document.querySelector<HTMLInputFileElement>('input[type="file"]')!;

		inputFilePreview(inputElement);

		inputElement.dispatchEvent(new Event('change'));

		expect(document.body.innerHTML).toBe(initBodyHTML); // change イベントを発生させただけでは何も変わらない
	});
});
