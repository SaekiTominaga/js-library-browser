import { beforeAll, describe, expect, test } from '@jest/globals';
import textareaAutoSize from './textareaAutoSize.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<textarea></textarea>`;

		textareaAutoSize(document.querySelector('textarea')!);
	});

	test('load', () => {
		const $textarea = document.querySelector('textarea')!;

		window.dispatchEvent(new InputEvent('load'));

		expect($textarea.textContent).toBe('');
		expect($textarea.style.cssText).toBe('block-size: 0px;'); // TODO: jsdom では常に 0px しか取得できない
	});

	test('input', () => {
		const INPUT_TEXT = 'text';

		const $textarea = document.querySelector('textarea')!;

		$textarea.textContent = INPUT_TEXT;
		$textarea.dispatchEvent(new InputEvent('input'));

		expect($textarea.textContent).toBe(INPUT_TEXT);
		expect($textarea.style.cssText).toBe('block-size: 0px;'); // TODO: jsdom では常に 0px しか取得できない
	});
});

describe('box-sizing', () => {
	beforeAll(() => {
		// eslint-disable-next-line @typescript-eslint/unbound-method
		const { getComputedStyle } = window;
		window.getComputedStyle = (elt: Element) => {
			const cssStyleDeclaration = getComputedStyle(elt);
			cssStyleDeclaration.setProperty('border-block-start-width', '2px');
			cssStyleDeclaration.setProperty('border-block-end-width', '3px');
			cssStyleDeclaration.setProperty('padding-block-start', '4px');
			cssStyleDeclaration.setProperty('padding-block-end', '5px');

			return cssStyleDeclaration;
		};
	});

	test('content-box', () => {
		document.body.innerHTML = `<textarea style="box-sizing: content-box; border-top: 2px solid black; border-bottom: 3px solid black; padding-block-start: 4px; padding-block-end: 5px"></textarea>`;

		const $textarea = document.querySelector('textarea')!;

		textareaAutoSize($textarea);
		window.dispatchEvent(new InputEvent('load'));

		expect($textarea.style.blockSize).toBe('-9px');
	});

	test('border-box', () => {
		document.body.innerHTML = `<textarea style="box-sizing: border-box; border-top: 2px solid black; border-bottom: 3px solid black; padding-block-start: 4px; padding-block-end: 5px"></textarea>`;

		const $textarea = document.querySelector('textarea')!;

		textareaAutoSize($textarea);
		window.dispatchEvent(new InputEvent('load'));

		expect($textarea.style.blockSize).toBe('5px');
	});
});
