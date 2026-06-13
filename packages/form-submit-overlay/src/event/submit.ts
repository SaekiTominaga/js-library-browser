import type Overlay from '../attribute/Overlay.ts';

/**
 * `submit` event
 *
 * @param _ev - SubmitEvent
 * @param data - Elements, attributes and others
 * @param data.overlayElement - Overlay
 */
export default (
	_ev: SubmitEvent,
	data: Readonly<{
		overlay: Overlay;
	}>,
): void => {
	const dialog = data.overlay.element;
	if (!dialog.open) {
		data.overlay.element.showModal();
	}
};
