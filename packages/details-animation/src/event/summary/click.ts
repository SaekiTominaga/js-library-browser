import type PreOpen from '../../attribute/PreOpen.ts';
import type DetailsContentElement from '../../custom-element/DetailsContent.ts';

/**
 * `click` event
 *
 * @param ev - Event
 * @param data - Elements and attributes
 * @param data.detailsElement - `<details>` element
 * @param data.detailsContentElement - DetailsContentElement
 * @param data.preOpen - `<details data-pre-open>` attribute
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		detailsElement: HTMLDetailsElement;
		detailsContentElement: DetailsContentElement;
		preOpen: PreOpen;
	}>,
): void => {
	ev.preventDefault();

	const toggledState = data.preOpen.toggle();
	if (toggledState) {
		data.detailsElement.open = true;

		data.detailsContentElement.open();
	} else {
		data.detailsContentElement.close();
	}
};
