import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import formSubmitOverlay from './formSubmitOverlay.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<form data-overlayed-by="overlay"></form>
<dialog id="overlay"></dialog>
`;
		formSubmitOverlay(document.querySelector('form')!);
	});

	test('submit', () => {
		const $form = document.querySelector('form')!;
		const $dialog = document.querySelector('dialog')!;

		const dialogShowModalSpy = jest.spyOn($dialog, 'showModal');

		$form.dispatchEvent(new Event('submit'));

		dialogShowModalSpy.mockRestore();

		expect(dialogShowModalSpy).toHaveBeenCalledWith();
	});

	test('pagehide', () => {
		const $dialog = document.querySelector('dialog')!;
		$dialog.open = true; // TODO: 本来は showModal() すべき

		const dialogCloseSpy = jest.spyOn($dialog, 'close');

		globalThis.dispatchEvent(new Event('pagehide'));

		dialogCloseSpy.mockRestore();

		expect(dialogCloseSpy).toHaveBeenCalledWith();
	});
});
