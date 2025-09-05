import MIMEType from 'whatwg-mimetype';
import { convert } from './util/errorMessage.ts';
import Preview from './attribute/Preview.ts';
import MaxSize from './attribute/MaxSize.ts';

/**
 * Show preview with `<input type=file>`
 */
export default class {
	readonly #inputFileElement: HTMLInputElement;

	readonly #preview: Preview; // プレビューを表示するテンプレート

	readonly #maxSize: MaxSize; // プレビューを行う最大サイズ

	readonly #previewElements = new Set<Element>(); // プレビューを表示する要素

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputElement) {
		this.#inputFileElement = thisElement;

		const { files } = thisElement;
		if (files === null) {
			throw new Error('Not a `<input type=file>`.');
		}

		const { preview: previewAttribute, maxSize: maxSizeAttribute } = thisElement.dataset;

		this.#preview = new Preview(previewAttribute);

		this.#maxSize = new MaxSize(maxSizeAttribute ?? '10485760');

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
	}

	/**
	 * ファイル選択時の処理
	 */
	#changeEvent = (): void => {
		const { files } = this.#inputFileElement;

		/* 既存のプレビューをリセット */
		this.#previewElements.forEach((element): void => {
			element.remove();
		});

		const fragment = document.createDocumentFragment();

		[...files!].forEach((file): void => {
			const templateElementClone = this.#preview.template.content.cloneNode(true) as DocumentFragment;

			const outputElement = templateElementClone.querySelector('output')!;
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

				let mediaElement: HTMLImageElement | HTMLAudioElement | HTMLVideoElement | undefined;
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
				}

				outputElement.appendChild(mediaElement!);
			});
		});

		let count = fragment.childElementCount;

		this.#preview.template.parentNode?.insertBefore(fragment, this.#preview.template);

		let previousElement = this.#preview.template.previousElementSibling!;

		while (count > 0) {
			this.#previewElements.add(previousElement);

			count -= 1;
			previousElement = previousElement.previousElementSibling!;
		}
	};
}
