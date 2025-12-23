import { beforeAll, describe, expect, test } from '@jest/globals';
import textareaAutoSize from './textareaAutoSize.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<textarea></textarea>`;

		textareaAutoSize(document.querySelector('textarea')!);
	});

	test('load', () => {
		const textareaElement = document.querySelector('textarea')!;

		window.dispatchEvent(new InputEvent('load'));

		expect(textareaElement.textContent).toBe('');
		expect(textareaElement.style.cssText).toBe('block-size: 0px;'); // TODO: jsdom では常に 0px しか取得できない
	});

	test('input', () => {
		const INPUT_TEXT = 'text';

		const textareaElement = document.querySelector('textarea')!;

		textareaElement.textContent = INPUT_TEXT;
		textareaElement.dispatchEvent(new InputEvent('input'));

		expect(textareaElement.textContent).toBe(INPUT_TEXT);
		expect(textareaElement.style.cssText).toBe('block-size: 0px;'); // TODO: jsdom では常に 0px しか取得できない
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

		const textareaElement = document.querySelector('textarea')!;

		textareaAutoSize(textareaElement);
		window.dispatchEvent(new InputEvent('load'));

		expect(textareaElement.style.blockSize).toBe('-9px');
	});

	test('border-box', () => {
		document.body.innerHTML = `<textarea style="box-sizing: border-box; border-top: 2px solid black; border-bottom: 3px solid black; padding-block-start: 4px; padding-block-end: 5px"></textarea>`;

		const textareaElement = document.querySelector('textarea')!;

		textareaAutoSize(textareaElement);
		window.dispatchEvent(new InputEvent('load'));

		expect(textareaElement.style.blockSize).toBe('5px');
	});
});
