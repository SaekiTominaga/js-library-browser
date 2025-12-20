import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * `mouseenter` event
 *
 * @param ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.delay - Delay time between mouse cursor moved within the trigger element and showing the popover (milliseconds)
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		delay: number;
	}>,
): void => {
	const popoverElement = ev.currentTarget as PopoverElement;

	clearTimeout(popoverElement.mouseleaveTimeoutId);

	popoverElement.mouseenterTimeoutId = setTimeout((): void => {
		show(ev.type, popoverElement);
	}, data.delay);
};
