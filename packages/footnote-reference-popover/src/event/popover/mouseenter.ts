import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * `mouseenter` event
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
	clearTimeout(popover.mouseleaveTimeoutId);

	popover.mouseenterTimeoutId = setTimeout((): void => {
		show(ev.type, popover);
	}, options.delay);
};
