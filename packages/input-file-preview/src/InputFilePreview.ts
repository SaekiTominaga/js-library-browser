import MIMEType from 'whatwg-mimetype';
import type { HTMLInputFileElement } from '../@types/lib.dom.d.ts';
import { convert } from './util/errorMessage.ts';
import Preview from './attribute/Preview.ts';
import MaxSize from './attribute/MaxSize.ts';

/**
 * Show preview with `<input type=file>`
 */
export default class {
	readonly #inputFileElement: HTMLInputFileElement;

	readonly #preview: Preview; // プレビューを表示するテンプレート

	readonly #maxSize: MaxSize; // プレビューを行う最大サイズ

	readonly #previewElements: HTMLElement[] = []; // プレビューを表示する要素

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputFileElement) {
		this.#inputFileElement = thisElement;

		const { preview: previewAttribute, maxSize: maxSizeAttribute } = thisElement.dataset;

		this.#preview = new Preview(previewAttribute);

		this.#maxSize = new MaxSize(maxSizeAttribute ?? '10485760');

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
	}

	/**
	 * ファイル選択時の処理
	 */
	readonly #changeEvent = (): void => {
		const { files } = this.#inputFileElement;

		/* 既存のプレビューをリセット */
		this.#previewElements.forEach((element): void => {
			element.remove();
		});

		const fragment = document.createDocumentFragment();

		[...files].forEach((file): void => {
			const templateElementClone = this.#preview.template.content.cloneNode(true) as DocumentFragment;

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const outputElement = templateElementClone.querySelector('output')!; // Preview.ts にて存在チェック済み
			outputElement.replaceChildren();

			fragment.appendChild(templateElementClone);

			const { name: fileName, size: fileSize, type: fileType } = file;
			const { type } = new MIMEType(fileType);

			/* ファイルが読み込み対象であるかどうかのチェック */
			if ((this.#maxSize.value !== undefined && fileSize > this.#maxSize.value) || !['image', 'audio', 'video'].includes(type)) {
				outputElement.insertAdjacentHTML('beforeend', convert(this.#preview.outputHtml, file));
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

				outputElement.appendChild(mediaElement);
			});
		});

		const { parentNode } = this.#preview.template;
		if (parentNode !== null) {
			parentNode.insertBefore(fragment, this.#preview.template);

			this.#previewElements.splice(
				0,
				this.#previewElements.length,
				...Array.from(parentNode.querySelectorAll<HTMLElement>(':scope > *')).filter((element) => element !== this.#preview.template),
			);
		}
	};
}
