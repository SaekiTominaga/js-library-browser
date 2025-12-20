import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * `click` event
 *
 * @param ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.popoverElement - PopoverElement
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		popoverElement: PopoverElement;
	}>,
): void => {
	ev.preventDefault();

	clearTimeout(data.popoverElement.mouseleaveTimeoutId);

	show(ev.type, data.popoverElement);
};
