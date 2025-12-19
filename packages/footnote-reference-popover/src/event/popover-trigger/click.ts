import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * `click` event
 *
 * @param ev - MouseEvent
 * @param popover - PopoverElement
 */
export default (ev: MouseEvent, popover: PopoverElement): void => {
	ev.preventDefault();

	clearTimeout(popover.mouseleaveTimeoutId);

	show(ev.type, popover);
};
