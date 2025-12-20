import type PopoverElement from '../../custom-element/Popover.ts';
import { hide } from '../../footnoteReferencePopover.ts';

/**
 * `mouseleave` event
 *
 * @param ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.popoverElement - PopoverElement
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		popoverElement: PopoverElement;
		delay: number;
	}>,
): void => {
	clearTimeout(data.popoverElement.mouseenterTimeoutId);

	data.popoverElement.mouseleaveTimeoutId = setTimeout((): void => {
		hide(ev.type, data.popoverElement);
	}, data.delay);
};
