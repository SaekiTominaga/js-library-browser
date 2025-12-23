import WrtingMode from '@w0s/writing-mode';
import inputEvent from './event/input.ts';
import loadEvent from './event/load.ts';

/**
 * Get block size for the element (Include padding, but not margin, border)
 *
 * @param textareaElement - <textarea>
 *
 * @returns Block size
 */
export const getBlockSize = (textareaElement: HTMLTextAreaElement): number => {
	let horizontal: boolean;
	try {
		horizontal = new WrtingMode(textareaElement).isHorizontal();
	} catch (e) {
		/* TODO: jsdom は `getComputedStyle()` で CSS の継承を認識しない https://github.com/jsdom/jsdom/issues/2160 */
		return 0;
	}

	return horizontal ? textareaElement.scrollHeight : textareaElement.scrollWidth;
};

/**
 * Set block size for the element
 *
 * @param textareaElement - <textarea>
 */
export const setBlockSize = (textareaElement: HTMLTextAreaElement): void => {
	textareaElement.style.blockSize = 'unset';

	let blockSizePx = getBlockSize(textareaElement);

	const { boxSizing, paddingBlockStart, paddingBlockEnd, borderBlockStartWidth, borderBlockEndWidth } = getComputedStyle(textareaElement);

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

	textareaElement.style.blockSize = `${String(blockSizePx)}px`;
};

/**
 * Automatically adjust the block size dimension of the `<textarea>` element to the input content
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLTextAreaElement): void => {
	window.addEventListener(
		'load',
		(ev: Event) => {
			loadEvent(ev, {
				textareaElement: thisElement,
			});
		},
		{ once: true, passive: true },
	);
	thisElement.addEventListener(
		'input',
		(ev: Event) => {
			inputEvent(ev);
		},
		{ passive: true },
	);
};
