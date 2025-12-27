import type ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';
import { validate } from './util.ts';

/**
 * `submit` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and others
 * @param data.validationMessageIsbnCheckdigit - ValidationMessageIsbnCheckdigit
 */
export default (
	ev: Event,
	data: Readonly<{
		validationMessageIsbnCheckdigit: ValidationMessageIsbnCheckdigit;
	}>,
): void => {
	const inputElement = ev.currentTarget as HTMLInputElement;

	if (inputElement.validity.patternMismatch) {
		/* ブラウザ標準機能によるチェックを優先する */
		inputElement.setCustomValidity('');
		return;
	}

	validate(inputElement, {
		validationMessageIsbnCheckdigit: data.validationMessageIsbnCheckdigit,
	});
};
