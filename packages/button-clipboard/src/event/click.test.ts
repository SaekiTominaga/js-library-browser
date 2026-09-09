import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import Data from '../attribute/Data.ts';
import Feedback from '../attribute/Feedback.ts';
import clickEvent from './click.ts';

beforeAll(() => {
	Object.assign(navigator, {
		clipboard: {
			writeText: () => {
				/**/
			},
		},
	});
});

describe('data', () => {
	let clipboardWriteTextSpy: SpiedFunction<(data: string) => Promise<void>>;
	let consoleInfoSpy: SpiedFunction;

	beforeEach(() => {
		clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
		consoleInfoSpy = jest.spyOn(console, 'info');
	});

	afterEach(() => {
		clipboardWriteTextSpy.mockRestore();
		consoleInfoSpy.mockRestore();
	});

	test('text', async () => {
		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback();

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Clipboard write successfully', 'Text');
	});

	test('target', async () => {
		document.body.innerHTML = `<p id="target">Text</p>`;

		const event = new MouseEvent('click');
		const data = new Data({ target: 'target' });
		const feedback = new Feedback();

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Clipboard write successfully', 'Text');
	});
});

describe('feedback', () => {
	let clipboardWriteTextSpy: SpiedFunction<(data: string) => Promise<void>>;

	beforeAll(() => {
		document.body.innerHTML = `<p id="feedback" hidden="">Success</p>`;
	});

	beforeEach(() => {
		clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
	});

	afterEach(() => {
		clipboardWriteTextSpy.mockRestore();
	});

	test('text', async () => {
		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback('feedback');

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(feedback.element?.hidden).toBeFalsy();
	});
});
