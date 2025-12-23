import { setBlockSize } from '../textareaAutoSize.ts';

/**
 * `input` event
 *
 * @param ev - Event
 */
export default (ev: Event): void => {
	const textareaElement = ev.currentTarget as HTMLTextAreaElement;

	setBlockSize(textareaElement);
};
