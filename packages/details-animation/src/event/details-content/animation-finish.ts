import type { AnimationFinishEventDetail } from '../../custom-element/DetailsContent.ts';

/**
 * `animation-finish` event
 *
 * @param ev - Event
 * @param detailsElement - HTMLDetailsElement
 */
export default (ev: CustomEvent<AnimationFinishEventDetail>, detailsElement: HTMLDetailsElement): void => {
	const { detail } = ev;

	switch (detail.orientation) {
		case 'close': {
			detailsElement.open = false;

			break;
		}
		default:
	}
};
