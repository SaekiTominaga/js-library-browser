import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * Image preload
 *
 * @param imageSrc - Image path
 */
const preload = (imageSrc: string | undefined): void => {
	if (imageSrc === undefined || imageSrc.startsWith('data:')) {
		return;
	}

	new Image().src = imageSrc;
};

/**
 * `mouseenter` event
 *
 * @param ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.popoverElement - PopoverElement
 * @param data.delay - Delay time between mouse cursor moved within the trigger element and showing the popover (milliseconds)
 * @param data.preloadImageSrc - Image path for preload
 */
export default (
	ev: MouseEvent,
	data: Readonly<{
		popoverElement: PopoverElement;
		delay: number;
		preloadImageSrc: string | undefined;
	}>,
): void => {
	clearTimeout(data.popoverElement.mouseleaveTimeoutId);

	preload(data.preloadImageSrc);

	data.popoverElement.mouseenterTimeoutId = setTimeout((): void => {
		show(ev.type, data.popoverElement);
	}, data.delay);
};
