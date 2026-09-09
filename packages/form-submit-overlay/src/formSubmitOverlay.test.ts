import { afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import formSubmitOverlay from './formSubmitOverlay.ts';

describe('event', () => {
	let dialogShowModalSpy: SpiedFunction;

	beforeAll(() => {
		document.body.innerHTML = `
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`;
		formSubmitOverlay(document.querySelector('form')!);
	});

	afterEach(() => {
		dialogShowModalSpy.mockRestore();
	});

	test('submit', () => {
		const $form = document.querySelector('form')!;
		const $dialog = document.querySelector('dialog')!;

		dialogShowModalSpy = jest.spyOn($dialog, 'showModal');

		$form.dispatchEvent(new Event('submit'));

		expect(dialogShowModalSpy).toHaveBeenCalledWith();
	});

	test('pagehide', () => {
		const $dialog = document.querySelector('dialog')!;
		$dialog.open = true; // TODO: 本来は showModal() すべき

		const dialogCloseSpy = jest.spyOn($dialog, 'close');

		globalThis.dispatchEvent(new Event('pagehide'));

		expect(dialogCloseSpy).toHaveBeenCalledWith();
	});
});
