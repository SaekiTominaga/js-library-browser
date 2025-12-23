import { setBlockSize } from '../textareaAutoSize.ts';

/**
 * `load` event
 *
 * @param _ev - Event
 * @param data - Elements, attributes and another data
 * @param data.textareaElement - <textarea>
 */
export default (
	_ev: Event,
	data: {
		textareaElement: HTMLTextAreaElement;
	},
): void => {
	setBlockSize(data.textareaElement);
};
