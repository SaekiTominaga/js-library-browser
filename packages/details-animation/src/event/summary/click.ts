import type PreOpen from '../../attribute/PreOpen.ts';
import type DetailsContentElement from '../../custom-element/DetailsContent.ts';

/**
 * `click` event
 *
 * @param ev - Event
 * @param detailsElement - HTMLDetailsElement
 * @param detailsContentElement - DetailsContentElement
 * @param options -
 */
export default (
	ev: MouseEvent,
	detailsElement: HTMLDetailsElement,
	detailsContentElement: DetailsContentElement,
	options: Readonly<{
		preOpen: PreOpen;
	}>,
): void => {
	ev.preventDefault();

	const toggledState = options.preOpen.toggle();
	if (toggledState) {
		detailsElement.open = true;

		detailsContentElement.open();
	} else {
		detailsContentElement.close();
	}
};
