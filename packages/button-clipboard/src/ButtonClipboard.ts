import Data from './attribute/Data.ts';
import Feedback from './attribute/Feedback.ts';
import { getContent } from './util/html.ts';

/**
 * Clipboard write text button
 */
export default class {
	readonly #data: Data;

	readonly #feedback: Feedback;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const { text: textAttribute, target: targetAttribute, feedback: feedbackAttribute } = thisElement.dataset;

		this.#data = new Data({ text: textAttribute, target: targetAttribute });
		this.#feedback = new Feedback(feedbackAttribute);

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		const data = this.#data.text ?? getContent(this.#data.element!); // `data-text` と `data-target` が両方指定されている場合は前者を優先する

		await navigator.clipboard.writeText(data);

		if (this.#feedback.element !== undefined) {
			this.#feedback.element.hidden = false;
		} else {
			console.info('Clipboard write successfully.', data);
		}
	};
}
