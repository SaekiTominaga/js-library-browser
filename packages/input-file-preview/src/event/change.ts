import MIMEType from 'whatwg-mimetype';
import type { HTMLInputFileElement } from '../../@types/lib.dom.ts';
import { convert } from '../util/errorMessage.ts';
import type MaxSize from '../attribute/MaxSize.ts';
import type Preview from '../attribute/Preview.ts';

/**
 * `submit` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and others
 * @param data.previewElements -
 */
export default (
	ev: Event,
	data: Readonly<{
		preview: Preview;
		maxSize: MaxSize;
	}>,
): void => {
	const inputFileElement = ev.currentTarget as HTMLInputFileElement;
	const { files } = inputFileElement;

	const { parentNode: templateParentNode } = data.preview.template;
	if (templateParentNode === null) {
		throw new Error('The parent element of the `<template>` element does not exist.'); // `<template>` 要素がルート要素ないし `DocumentFragment` であることはあり得ないのでここには到達しない
	}

	/* 既存のプレビューをクリア */
	Array.from(templateParentNode.querySelectorAll<HTMLElement>(':scope > [data-cloned="template"]')).forEach((element): void => {
		element.remove();
	});

	const fragment = document.createDocumentFragment();

	[...files].forEach((file): void => {
		const templateElementClone = data.preview.template.content.cloneNode(true) as DocumentFragment;

		/* 次の change イベント発生時に子要素を削除するために目印を付ける */
		Array.from(templateElementClone.children).forEach((element) => {
			(element as HTMLElement).dataset['cloned'] = 'template';
		});

		const outputElement = templateElementClone.querySelector('output');
		outputElement?.replaceChildren();

		fragment.appendChild(templateElementClone);

		const { name: fileName, size: fileSize, type: fileType } = file;
		const { type } = new MIMEType(fileType);

		/* ファイルが読み込み対象であるかどうかのチェック */
		if ((data.maxSize.value !== undefined && fileSize > data.maxSize.value) || !['image', 'audio', 'video'].includes(type)) {
			outputElement?.insertAdjacentHTML('beforeend', convert(data.preview.outputHtml, file));
			return;
		}

		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.addEventListener('load', (): void => {
			const fileReaderResult = fileReader.result;
			if (fileReaderResult === null) {
				throw new Error('File load failed.');
			}

			let mediaElement: HTMLImageElement | HTMLAudioElement | HTMLVideoElement;
			switch (type) {
				case 'image': {
					mediaElement = document.createElement('img');
					mediaElement.src = fileReaderResult as string;
					mediaElement.alt = fileName;
					break;
				}
				case 'audio': {
					mediaElement = document.createElement('audio');
					mediaElement.src = fileReaderResult as string;
					mediaElement.controls = true;
					mediaElement.textContent = fileName;
					break;
				}
				case 'video': {
					mediaElement = document.createElement('video');
					mediaElement.src = fileReaderResult as string;
					mediaElement.controls = true;
					mediaElement.textContent = fileName;
					break;
				}
				default:
					/* 文字列チェックを行っているのでここには来ない */
					throw new Error();
			}

			outputElement?.appendChild(mediaElement);
		});
	});

	templateParentNode.insertBefore(fragment, data.preview.template);
};
