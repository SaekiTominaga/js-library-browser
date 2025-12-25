import Overlay from './attribute/Overlay.ts';
import windowBeforeUnloadEvent from './event/window/beforeunload.ts';
import submitEvent from './event/submit.ts';

/**
 * Cover the entire screen with an overlay when form submitting
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLFormElement): void => {
	const { overlayedBy: overlayedByAttribute } = thisElement.dataset;

	const overlay = new Overlay(overlayedByAttribute);

	thisElement.addEventListener(
		'submit',
		(ev: SubmitEvent) => {
			submitEvent(ev, {
				overlay: overlay,
			});
		},
		{ passive: true },
	);

	window.addEventListener(
		'beforeunload',
		(ev: BeforeUnloadEvent) => {
			windowBeforeUnloadEvent(ev, {
				overlay: overlay,
			});
		},
		{ passive: true },
	);
};
