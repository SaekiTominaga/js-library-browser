import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * `pointerenter` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and another data
 * @param data.delay - Delay time between mouse cursor moved within the trigger element and showing the popover (milliseconds)
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

	clearTimeout(popoverElement.mouseleaveTimeoutId);

	popoverElement.mouseenterTimeoutId = setTimeout((): void => {
		show(ev.type, popoverElement);
	}, data.delay);
};
