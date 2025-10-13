import { describe, beforeEach, afterEach, test, expect, jest } from '@jest/globals';
import FormSubmitOverlay from './FormSubmitOverlay.ts';

/* jsdom が `<dialog>` 要素をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294 */
HTMLDialogElement.prototype.close = jest.fn();
HTMLDialogElement.prototype.show = jest.fn();
HTMLDialogElement.prototype.showModal = jest.fn();

describe('event', () => {
	beforeEach(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`,
		);
	});

	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('submit', () => {
		const element = document.querySelector('form')!;
		const dialogElement = document.querySelector('dialog')!;
		const spy = jest.spyOn(dialogElement, 'showModal');

		new FormSubmitOverlay(element);

		element.dispatchEvent(new Event('submit'));

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});

	test('beforeunload', () => {
		const element = document.querySelector('form')!;
		const dialogElement = document.querySelector('dialog')!;
		const spy = jest.spyOn(dialogElement, 'close');

		new FormSubmitOverlay(element);

		window.dispatchEvent(new Event('beforeunload'));

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});
});
