import type PopoverElement from '../../custom-element/Popover.ts';
import { hide } from '../../footnoteReferencePopover.ts';

/**
 * `pointerleave` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and another data
 * @param data.delay - Delay time between mouse cursor moved out of the trigger element or popover and closing the popover (milliseconds)
 */
export default (
	ev: PointerEvent,
	data: Readonly<{
		delay: number;
	}>,
): void => {
	if (ev.pointerType !== 'mouse') {
		return;
	}

	const popoverElement = ev.currentTarget as PopoverElement;

	clearTimeout(popoverElement.mouseenterTimeoutId);

	popoverElement.mouseleaveTimeoutId = setTimeout((): void => {
		hide(ev.type, popoverElement);
	}, data.delay);
};
