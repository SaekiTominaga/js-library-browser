import { afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import Data from '../attribute/Data.ts';
import Feedback from '../attribute/Feedback.ts';
import clickEvent from './click.ts';

const sleep = (ms: number) =>
	// oxlint-disable-next-line promise/avoid-new
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

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
		const feedback = new Feedback({});

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Copied to clipboard!: Text');
	});

	test('target', async () => {
		document.body.innerHTML = `<output id="target">Text</output>`;

		const event = new MouseEvent('click');
		const data = new Data({ element: 'target' });
		const feedback = new Feedback({});

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(consoleInfoSpy).toHaveBeenCalledWith('Copied to clipboard!: Text');
	});
});

describe('feedback', () => {
	let clipboardWriteTextSpy: SpiedFunction<(data: string) => Promise<void>>;

	beforeAll(() => {
		document.body.innerHTML = `<output id="feedback">default text</output>`;
	});

	beforeEach(() => {
		clipboardWriteTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
	});

	afterEach(() => {
		clipboardWriteTextSpy.mockRestore();
	});

	test('no duration', async () => {
		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback({ element: 'feedback', text: 'Success' });

		expect(feedback.$element?.textContent).toBe('default text');

		await clickEvent(event, data, feedback);

		expect(clipboardWriteTextSpy).toHaveBeenCalledWith('Text');
		expect(feedback.$element?.textContent).toBe('Success');

		await sleep(100);

		expect(feedback.$element?.textContent).toBe('Success');
	});

	test('set duration', async () => {
		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback({ element: 'feedback', text: 'Success', duration: '100ms' });

		await clickEvent(event, data, feedback);

		expect(feedback.$element?.textContent).toBe('Success');

		await sleep(100);

		expect(feedback.$element?.textContent).toBe('default text');
	});

	test('repeated pressing', async () => {
		const event = new MouseEvent('click');
		const data = new Data({ text: 'Text' });
		const feedback = new Feedback({ element: 'feedback', text: 'Success', duration: '100ms' });

		await clickEvent(event, data, feedback);

		expect(feedback.$element?.textContent).toBe('Success');

		await sleep(50);
		await clickEvent(event, data, feedback); // 非表示になる前に再度ボタン押下

		await sleep(90); // 最初のボタン押下から100ms以上経過、ただし2回目のボタン押下からは100ms経っていない

		expect(feedback.$element?.textContent).toBe('Success');

		await sleep(10); // 2回目のボタン押下から100ms経過

		expect(feedback.$element?.textContent).toBe('default text');
	});
});
