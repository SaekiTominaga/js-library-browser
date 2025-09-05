import { describe, afterEach, test, expect, jest } from '@jest/globals';
import ButtonConfirm from './ButtonConfirm.ts';

window.confirm = () => true;

describe('click event', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('data-message', () => {
		const spyConfirm = jest.spyOn(window, 'confirm');
		document.body.insertAdjacentHTML('beforeend', '<button data-message="Message text">Submit</button>');

		const element = document.querySelector('button')!;

		new ButtonConfirm(element);

		element.dispatchEvent(new Event('click'));

		expect(spyConfirm).toHaveBeenCalledWith('Message text');
		spyConfirm.mockRestore();
	});
});
