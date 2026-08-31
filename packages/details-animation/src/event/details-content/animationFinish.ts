import type { AnimationFinishEventDetail } from '../../custom-element/DetailsContent.ts';

/**
 * `animation-finish` event
 *
 * @param ev - Event
 * @param data - Elements and attributes
 * @param data.detailsElement - `<details>` element
 */
export default (
	ev: CustomEvent<AnimationFinishEventDetail>,
	data: Readonly<{
		detailsElement: HTMLDetailsElement;
	}>,
): void => {
	const { detail } = ev;

	switch (detail.orientation) {
		case 'close': {
			data.detailsElement.open = false;
			break;
		}
		default:
	}
};
