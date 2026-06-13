import Overlay from './attribute/Overlay.ts';
import windowPagehideEvent from './event/window/pagehide.ts';
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
		'pagehide',
		(ev: PageTransitionEvent) => {
			windowPagehideEvent(ev, {
				overlay: overlay,
			});
		},
		{ passive: true },
	);
};
