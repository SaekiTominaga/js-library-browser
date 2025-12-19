import type PopoverElement from '../../custom-element/Popover.ts';
import { hide } from '../../footnoteReferencePopover.ts';

/**
 * `mouseleave` event
 *
 * @param ev - MouseEvent
 * @param popover - PopoverElement
 * @param options -
 */
export default (
	ev: MouseEvent,
	popover: PopoverElement,
	options: Readonly<{
		delay: number;
	}>,
): void => {
	clearTimeout(popover.mouseenterTimeoutId);

	popover.mouseleaveTimeoutId = setTimeout((): void => {
		hide(ev.type, popover);
	}, options.delay);
};
