import Data from './attribute/Data.ts';
import Feedback from './attribute/Feedback.ts';
import clickEvent from './event/click.ts';

/**
 * Clipboard write text button
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	const {
		text: textAttribute,
		target: targetAttribute,
		feedbackText: feedbackTextAttribute,
		feedbackedBy: feedbackedByAttribute,
		feedbackDuration: feedbackDurationAttribute,
	} = thisElement.dataset;

	const data = new Data({ text: textAttribute, element: targetAttribute });
	const feedback = new Feedback({
		text: feedbackTextAttribute,
		element: feedbackedByAttribute,
		duration: feedbackDurationAttribute,
	});

	thisElement.addEventListener(
		'click',
		(ev: MouseEvent) => {
			void clickEvent(ev, data, feedback);
		},
		{ passive: true },
	);
};
