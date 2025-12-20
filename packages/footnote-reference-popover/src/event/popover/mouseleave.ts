import type PopoverElement from '../../custom-element/Popover.ts';
import { hide } from '../../footnoteReferencePopover.ts';

/**
 * `mouseleave` event
 *
 * @param ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.delay - Delay time between mouse cursor moved out of the trigger element or popover and closing the popover (milliseconds)
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		delay: number;
	}>,
): void => {
	const popoverElement = ev.currentTarget as PopoverElement;

	clearTimeout(popoverElement.mouseenterTimeoutId);

	popoverElement.mouseleaveTimeoutId = setTimeout((): void => {
		hide(ev.type, popoverElement);
	}, data.delay);
};
