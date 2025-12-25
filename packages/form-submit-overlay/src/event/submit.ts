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
	data.overlay.element.showModal();
};
