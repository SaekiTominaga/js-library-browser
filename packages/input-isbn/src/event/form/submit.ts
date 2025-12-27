import type ValidationMessageIsbnCheckdigit from '../../attribute/ValidationMessageIsbnCheckdigit.ts';
import { validate } from '../util.ts';

/**
 * `submit` event
 *
 * @param ev - SubmitEvent
 * @param data - Elements, attributes and others
 * @param data.inputElement - HTMLInputElement
 * @param data.validationMessageIsbnCheckdigit - ValidationMessageIsbnCheckdigit
 */
export default (
	ev: SubmitEvent,
	data: Readonly<{
		inputElement: HTMLInputElement;
		validationMessageIsbnCheckdigit: ValidationMessageIsbnCheckdigit;
	}>,
): void => {
	if (
		!validate(data.inputElement, {
			validationMessageIsbnCheckdigit: data.validationMessageIsbnCheckdigit,
		})
	) {
		ev.preventDefault();
	}
};
