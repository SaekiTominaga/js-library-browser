import type PopoverElement from '../../custom-element/Popover.ts';
import { show } from '../../footnoteReferencePopover.ts';

/**
 * @param imageSrc - 画像パス
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
 * @param popover - PopoverElement
 * @param options -
 */
export default (
	ev: MouseEvent,
	popover: PopoverElement,
	options: Readonly<{
		delay: number;
		preloadImageSrc: string | undefined;
	}>,
): void => {
	clearTimeout(popover.mouseleaveTimeoutId);

	preload(options.preloadImageSrc);

	popover.mouseenterTimeoutId = setTimeout((): void => {
		show(ev.type, popover);
	}, options.delay);
};
