import WrtingMode from '@w0s/writing-mode';

/**
 * Automatically adjust the block size dimension of the `<textarea>` element to the input content
 */
export default class {
	readonly #textareaElement: HTMLTextAreaElement;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLTextAreaElement) {
		this.#textareaElement = thisElement;

		this.#setBlockSize();

		thisElement.addEventListener('input', this.#inputEvent, { passive: true });
	}

	/**
	 * 入力時の処理
	 */
	readonly #inputEvent = (): void => {
		this.#setBlockSize();
	};

	/**
	 * Get block size for the element (Include padding, but not margin, border)
	 *
	 * @returns Block size
	 */
	#getBlockSize(): number {
		let horizontal: boolean;
		try {
			horizontal = new WrtingMode(this.#textareaElement).isHorizontal();
		} catch (e) {
			/* TODO: jsdom は `getComputedStyle()` で CSS の継承を認識しない https://github.com/jsdom/jsdom/issues/2160 */
			return 0;
		}

		return horizontal ? this.#textareaElement.scrollHeight : this.#textareaElement.scrollWidth;
	}

	/**
	 * Set block size for the element
	 */
	#setBlockSize() {
		this.#textareaElement.style.blockSize = 'unset';

		let blockSizePx = this.#getBlockSize();

		const { boxSizing, paddingBlockStart, paddingBlockEnd, borderBlockStartWidth, borderBlockEndWidth } = getComputedStyle(this.#textareaElement);

		switch (boxSizing) {
			case 'content-box': {
				const paddingBlockStartPx = Number.parseInt(paddingBlockStart, 10);
				if (!Number.isNaN(paddingBlockStartPx)) {
					blockSizePx -= paddingBlockStartPx;
				}
				const paddingBlockEndPx = Number.parseInt(paddingBlockEnd, 10);
				if (!Number.isNaN(paddingBlockEndPx)) {
					blockSizePx -= paddingBlockEndPx;
				}
				break;
			}
			case 'border-box': {
				const borderBlockStartWidthPx = Number.parseInt(borderBlockStartWidth, 10);
				if (!Number.isNaN(borderBlockStartWidthPx)) {
					blockSizePx += borderBlockStartWidthPx;
				}
				const borderBlockEndWidthPx = Number.parseInt(borderBlockEndWidth, 10);
				if (!Number.isNaN(borderBlockEndWidthPx)) {
					blockSizePx += borderBlockEndWidthPx;
				}
				break;
			}
			default:
		}

		this.#textareaElement.style.blockSize = `${String(blockSizePx)}px`;
	}
}
