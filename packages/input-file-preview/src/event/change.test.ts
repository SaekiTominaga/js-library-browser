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
		const $input = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty($input, 'files', {
			value: [createFile(undefined, 'test1.png', 'image/png'), createFile(undefined, 'test2.mp3', 'audio/mp3')],
			configurable: true,
		});

		const preview = new Preview($input.dataset['preview']);
		const maxSize = new MaxSize($input.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

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
		const $input = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty($input, 'files', {
			value: [createFile(undefined, 'test3.mp4', 'video/mp4')],
			configurable: true,
		});

		const preview = new Preview($input.dataset['preview']);
		const maxSize = new MaxSize($input.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

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

		// @ts-expect-error: ts(2345)
		jest.spyOn(globalThis, 'FileReader').mockReturnValue(mockFileReader);
	});

	test('file types', () => {
		const $input = document.querySelector<HTMLInputFileElement>('input[type=file]')!;
		Object.defineProperty($input, 'files', {
			value: [
				createFile(undefined, 'test1.png', 'image/png'),
				createFile(undefined, 'test2.mp3', 'audio/mp3'),
				createFile(undefined, 'test3.mp4', 'video/mp4'),
				createFile(undefined, 'test4.txt', 'text/plain'),
				createFile(undefined, 'test5.xxx', ''),
				createFile('xx', 'test6.png', 'image/png'),
			],
		});

		const preview = new Preview($input.dataset['preview']);
		const maxSize = new MaxSize($input.dataset['maxSize']);

		const event = new Event('change');
		Object.defineProperty(event, 'currentTarget', { value: $input });

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

		const $outputs = document.querySelectorAll('output');

		expect($outputs).toHaveLength(6);
		expect($outputs.item(0).innerHTML).toBe(`<img src="${FILE_READER_RESULT}" alt="test1.png">`);
		expect($outputs.item(1).innerHTML).toBe(`<audio src="${FILE_READER_RESULT}" controls="">test2.mp3</audio>`);
		expect($outputs.item(2).innerHTML).toBe(`<video src="${FILE_READER_RESULT}" controls="">test3.mp4</video>`);
		expect($outputs.item(3).innerHTML).toBe(`foo`);
		expect($outputs.item(4).innerHTML).toBe(`foo`);
		expect($outputs.item(5).innerHTML).toBe(`foo`);
	});
});
