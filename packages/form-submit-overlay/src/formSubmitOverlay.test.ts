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
		const formElement = document.querySelector('form')!;
		const dialogElement = document.querySelector('dialog')!;

		const dialogShowModalSpy = jest.spyOn(dialogElement, 'showModal');

		formElement.dispatchEvent(new Event('submit'));

		expect(dialogShowModalSpy).toHaveBeenCalled();

		dialogShowModalSpy.mockRestore();
	});

	test('beforeunload', () => {
		const dialogElement = document.querySelector('dialog')!;

		const dialogCloseSpy = jest.spyOn(dialogElement, 'close');

		window.dispatchEvent(new Event('beforeunload'));

		expect(dialogCloseSpy).toHaveBeenCalled();

		dialogCloseSpy.mockRestore();
	});
});
