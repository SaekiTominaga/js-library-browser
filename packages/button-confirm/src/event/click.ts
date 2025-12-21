import type Message from '../attribute/Message.ts';

/**
 * `click` event
 *
 * @param ev - Event
 * @param data - Elements and attributes
 * @param data.message - `<button data-message>` attribute
 *
 * @returns `window.confirm()` の結果
 */
export default (
	ev: Event,
	data: Readonly<{
		message: Message;
	}>,
): boolean => {
	const confirmResult = confirm(data.message.text);
	if (!confirmResult) {
		ev.preventDefault();
	}

	return confirmResult;
};
