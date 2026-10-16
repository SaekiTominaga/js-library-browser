import type PopoverElement from '../../custom-element/Popover.ts';
import { hide } from '../../footnoteReferencePopover.ts';

/**
 * `pointerleave` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and another data
 * @param data.popoverElement - PopoverElement
 */
export default (
	ev: PointerEvent,
	data: Readonly<{
		popoverElement: PopoverElement;
		delay: number;
	}>,
): void => {
	if (ev.pointerType !== 'mouse') {
		return;
	}

	clearTimeout(data.popoverElement.mouseenterTimeoutId);

	data.popoverElement.mouseleaveTimeoutId = setTimeout((): void => {
		hide(ev.type, data.popoverElement);
	}, data.delay);
};
