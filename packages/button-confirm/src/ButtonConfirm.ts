import Message from './attribute/Message.ts';

/**
 * Display a `confirm()` modal dialog when button is pressed
 */
export default class {
	readonly #message: Message;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const { message: messageAttribute } = thisElement.dataset;

		this.#message = new Message(messageAttribute);

		thisElement.addEventListener('click', this.#clickEvent);
	}

	/**
	 * ボタン押下時の処理
	 *
	 * @param ev - MouseEvent
	 */
	#clickEvent = (ev: MouseEvent) => {
		if (!confirm(this.#message.text)) {
			ev.preventDefault();
		}
	};
}
