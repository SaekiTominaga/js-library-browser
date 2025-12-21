import Message from './attribute/Message.ts';
import clickEvent from './event/click.ts';

/**
 * Display a `confirm()` modal dialog when button is pressed
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	const { message: messageAttribute } = thisElement.dataset;

	const message = new Message(messageAttribute);

	thisElement.addEventListener('click', (ev: MouseEvent) => {
		clickEvent(ev, {
			message: message,
		});
	});
};
