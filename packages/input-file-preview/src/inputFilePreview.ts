import type { HTMLInputFileElement } from '../@types/lib.dom.ts';
import Preview from './attribute/Preview.ts';
import MaxSize from './attribute/MaxSize.ts';
import changeEvent from './event/change.ts';

/**
 * Show preview with `<input type=file>`
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLInputFileElement): void => {
	const { preview: previewAttribute, maxSize: maxSizeAttribute } = thisElement.dataset;

	const preview = new Preview(previewAttribute);

	const maxSize = new MaxSize(maxSizeAttribute ?? '10485760');

	thisElement.addEventListener(
		'change',
		(ev: Event) => {
			changeEvent(ev, {
				preview: preview,
				maxSize: maxSize,
			});
		},
		{ passive: true },
	);
};
