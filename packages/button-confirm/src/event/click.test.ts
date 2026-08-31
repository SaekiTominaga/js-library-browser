import { expect, jest, test } from '@jest/globals';
import Message from '../attribute/Message.ts';
import clickEvent from './click.ts';

test('OK', () => {
	const mockConfirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(true);

	const event = new MouseEvent('click');
	const message = new Message('text');

	const confirmResult = clickEvent(event, {
		message: message,
	});

	mockConfirm.mockRestore();

	expect(confirmResult).toBeTruthy();
});

test('Cancel', () => {
	const mockConfirm = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);

	const event = new MouseEvent('click');
	const message = new Message('text');

	const confirmResult = clickEvent(event, {
		message: message,
	});

	mockConfirm.mockRestore();

	expect(confirmResult).toBeFalsy(); // `event.defaultPrevented` が true であることをチェックしたいが false になってしまう
});
