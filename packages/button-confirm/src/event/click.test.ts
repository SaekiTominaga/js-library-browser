import { expect, jest, test } from '@jest/globals';
import Message from '../attribute/Message.ts';
import clickEvent from './click.ts';

test('OK', () => {
	const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => true);

	const event = new MouseEvent('click');
	const message = new Message('text');

	const confirmResult = clickEvent(event, {
		message: message,
	});

	expect(confirmResult).toBeTruthy();

	mockConfirm.mockRestore();
});

test('Cancel', () => {
	const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation(() => false);

	const event = new MouseEvent('click');
	const message = new Message('text');

	const confirmResult = clickEvent(event, {
		message: message,
	});

	expect(confirmResult).toBeFalsy(); // `event.defaultPrevented` が true であることをチェックしたいが false になってしまう

	mockConfirm.mockRestore();
});
