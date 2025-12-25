import type Overlay from '../../attribute/Overlay.ts';

/**
 * `beforeunload` event
 *
 * @param _ev - BeforeUnloadEvent
 * @param data - Elements, attributes and others
 * @param data.overlayElement - Overlay
 */
export default (
	_ev: BeforeUnloadEvent,
	data: Readonly<{
		overlay: Overlay;
	}>,
): void => {
	data.overlay.element.close();
};
