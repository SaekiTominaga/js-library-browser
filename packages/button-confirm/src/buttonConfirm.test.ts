import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import buttonConfirm from './buttonConfirm.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<button data-message="Message text">Submit</button>`;
	});

	test('click', () => {
		const mockConfirm = jest.spyOn(window, 'confirm');

		const buttonElement = document.querySelector('button')!;

		buttonConfirm(buttonElement);

		buttonElement.dispatchEvent(new Event('click'));

		expect(mockConfirm).toHaveBeenCalledWith('Message text');

		mockConfirm.mockRestore();
	});
});
