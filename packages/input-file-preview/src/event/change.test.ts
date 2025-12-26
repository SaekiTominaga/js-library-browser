import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import type { HTMLInputFileElement } from '../../@types/lib.dom.ts';
import MaxSize from '../attribute/MaxSize.ts';
import Preview from '../attribute/Preview.ts';
import changeEvent from './change.ts';

const createFile = (content: string | undefined, name: string, type: string): File => new File([content ?? ''], name, { type: type });

describe('exist preview elements clear', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<input type="file" data-preview="preview">
<template id="preview">
<output>foo</output>
</template>
`;
	});

	test('add two file', () => {
		const inputElement = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty(inputElement, 'files', {
			value: [createFile(undefined, 'test1.png', 'image/png'), createFile(undefined, 'test2.mp3', 'audio/mp3')],
			configurable: true,
		});

		const preview = new Preview(inputElement.dataset['preview']);
		const maxSize = new MaxSize(inputElement.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			preview,
			maxSize,
		});

		expect(document.body.innerHTML).toBe(`
<input type="file" data-preview="preview">

<output data-cloned="template"></output>

<output data-cloned="template"></output>
<template id="preview">
<output>foo</output>
</template>
`);
	});

	test('change one file', () => {
		const inputElement = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty(inputElement, 'files', {
			value: [createFile(undefined, 'test3.mp4', 'video/mp4')],
			configurable: true,
		});

		const preview = new Preview(inputElement.dataset['preview']);
		const maxSize = new MaxSize(inputElement.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			preview,
			maxSize,
		});

		expect(document.body.innerHTML).toBe(`
<input type="file" data-preview="preview">





<output data-cloned="template"></output>
<template id="preview">
<output>foo</output>
</template>
`);
	});
});

describe('<output> element', () => {
	const FILE_READER_RESULT = 'mock text';
	let mockAddEventListener: jest.Mock;

	beforeAll(() => {
		document.body.innerHTML = `
<input type="file" data-preview="preview" data-max-size="1">
<template id="preview">
<output>foo</output>
</template>
`;

		mockAddEventListener = jest.fn();

		const mockFileReader = {
			addEventListener: mockAddEventListener,
			readAsDataURL: jest.fn(),
			result: FILE_READER_RESULT,
		};

		// @ts-expect-error: ts(2739)
		global.FileReader = jest.fn(() => mockFileReader);
	});

	test('file types', () => {
		const inputElement = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty(inputElement, 'files', {
			value: [
				createFile(undefined, 'test1.png', 'image/png'),
				createFile(undefined, 'test2.mp3', 'audio/mp3'),
				createFile(undefined, 'test3.mp4', 'video/mp4'),
				createFile(undefined, 'test4.txt', 'text/plain'),
				createFile('xx', 'test5.png', 'image/png'),
			],
		});

		const preview = new Preview(inputElement.dataset['preview']);
		const maxSize = new MaxSize(inputElement.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: inputElement });

		changeEvent(event, {
			preview,
			maxSize,
		});

		mockAddEventListener.mock.calls
			.filter(([type]) => type === 'load')
			.forEach((call) => {
				// @ts-expect-error: ts(2571)
				call.at(1)();
			});

		const outputElements = document.querySelectorAll('output');

		expect(outputElements.length).toBe(5);
		expect(outputElements.item(0).innerHTML).toBe(`<img src="${FILE_READER_RESULT}" alt="test1.png">`);
		expect(outputElements.item(1).innerHTML).toBe(`<audio src="${FILE_READER_RESULT}" controls="">test2.mp3</audio>`);
		expect(outputElements.item(2).innerHTML).toBe(`<video src="${FILE_READER_RESULT}" controls="">test3.mp4</video>`);
		expect(outputElements.item(3).innerHTML).toBe(`foo`);
		expect(outputElements.item(4).innerHTML).toBe(`foo`);
	});
});
