import type Overlay from '../../attribute/Overlay.ts';

/**
 * `pagehide` event
 *
 * @param _ev - PageTransitionEvent
 * @param data - Elements, attributes and others
 * @param data.overlayElement - Overlay
 */
export default (
	_ev: PageTransitionEvent,
	data: Readonly<{
		overlay: Overlay;
	}>,
): void => {
	const dialog = data.overlay.element;
	if (dialog.open) {
		dialog.close();
	}
};
