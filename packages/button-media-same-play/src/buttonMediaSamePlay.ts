import Controles from './attribute/Controles.ts';
import Status from './attribute/Status.ts';
import clickEvent from './event/click.ts';

/**
 * Simultaneous playback button for multiple audio / video
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	const ariaControlsAttribute = thisElement.getAttribute('aria-controls');

	const controls = new Controles(ariaControlsAttribute);
	const status = new Status();

	thisElement.addEventListener(
		'click',
		async (ev: MouseEvent) => {
			await clickEvent(ev, {
				controls: controls,
				status: status,
			});
		},
		{ passive: true },
	);
};
