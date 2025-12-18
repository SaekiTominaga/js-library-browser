import { describe, expect, jest, test } from '@jest/globals';
import Data from '../attribute/Data.ts';
import Feedback from '../attribute/Feedback.ts';
import clickEvent from './click.ts';

Object.assign(navigator, {
	clipboard: {
		writeText: () => {
			/**/
		},
	},
});

describe('data', () => {
	test('text', async () => {
		const clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
		const consoleInfoSpy = jest.spyOn(console, 'info');

		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback();

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Clipboard write successfully.', 'Text');
		clipboardWriteTextSpy.mockRestore();
		consoleInfoSpy.mockRestore();
	});

	test('target', async () => {
		const clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
		const consoleInfoSpy = jest.spyOn(console, 'info');

		document.body.innerHTML = `<p id="target">Text</p>`;

		const event = new MouseEvent('click');
		const data = new Data({ target: 'target' });
		const feedback = new Feedback();

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Clipboard write successfully.', 'Text');
		clipboardWriteTextSpy.mockRestore();
		consoleInfoSpy.mockRestore();
	});
});

test('feedback', async () => {
	const clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');

	document.body.innerHTML = `<p id="feedback" hidden="">Success</p>`;

	const event = new MouseEvent('click');
	const data = new Data({ text: 'Text' });
	const feedback = new Feedback('feedback');

	await clickEvent(event, data, feedback);

	expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
	expect(feedback.element?.hidden).toBeFalsy();
	clipboardWriteTextSpy.mockRestore();
});
