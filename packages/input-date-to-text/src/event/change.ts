import Max from '../attribute/Max.ts';
import Min from '../attribute/Min.ts';
import type ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import type ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import type ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';
import { validate } from './util.ts';

/**
 * `submit` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and others
 * @param data.min - Min
 * @param data.max - Max
 * @param data.validationMessageNoExist - ValidationMessageNoExist
 * @param data.validationMessageMin - ValidationMessageMin
 * @param data.validationMessageMax - ValidationMessageMax
 */
export default (
	ev: Event,
	data: Readonly<{
		min: Min;
		max: Max;
		validationMessageNoExist: ValidationMessageNoExist;
		validationMessageMin: ValidationMessageMin;
		validationMessageMax: ValidationMessageMax;
	}>,
): void => {
	const inputElement = ev.currentTarget as HTMLInputElement;

	if (inputElement.validity.patternMismatch) {
		/* ブラウザ標準機能によるチェックを優先する */
		return;
	}

	validate(inputElement, {
		min: data.min,
		max: data.max,
		validationMessageNoExist: data.validationMessageNoExist,
		validationMessageMin: data.validationMessageMin,
		validationMessageMax: data.validationMessageMax,
	});
};
