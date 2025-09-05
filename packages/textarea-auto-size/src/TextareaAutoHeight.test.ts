import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import TextareaAutoSize from './TextareaAutoSize.ts';

describe('HTML', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('success', () => {
		document.body.insertAdjacentHTML('beforeend', '<textarea></textarea>');

		new TextareaAutoSize(document.querySelector('textarea')!);

		expect(document.body.innerHTML).toBe('<textarea style="block-size: 0px;"></textarea>');
	});
});

describe('size', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<textarea></textarea>');

		new TextareaAutoSize(document.querySelector('textarea')!);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('input event', () => {
		const element = document.querySelector('textarea');

		element?.dispatchEvent(new InputEvent('input'));

		/* TODO: */
	});
});

describe('box-sizing', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('box-sizing: content-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<textarea style="box-sizing: content-box; border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>',
		);

		const element = document.querySelector('textarea')!;

		new TextareaAutoSize(element);

		expect(element.style.blockSize).toBe('0px');
	});

	test('box-sizing: border-box', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			'<textarea style="box-sizing: border-box; border-top: 2px solid black; border-bottom: 3px solid black;"></textarea>',
		);

		const element = document.querySelector('textarea')!;

		new TextareaAutoSize(element);

		/* TODO: Jest + jsdom は倫理プロパティ未対応? */
	});
});
