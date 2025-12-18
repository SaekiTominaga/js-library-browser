import Data from './attribute/Data.ts';
import Feedback from './attribute/Feedback.ts';
import clickEvent from './event/click.ts';

/**
 * Clipboard write text button
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	const { text: textAttribute, target: targetAttribute, feedback: feedbackAttribute } = thisElement.dataset;

	const data = new Data({ text: textAttribute, target: targetAttribute });
	const feedback = new Feedback(feedbackAttribute);

	thisElement.addEventListener(
		'click',
		async (ev: MouseEvent) => {
			await clickEvent(ev, data, feedback);
		},
		{ passive: true },
	);
};
