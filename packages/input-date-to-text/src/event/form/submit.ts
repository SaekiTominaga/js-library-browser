import type Max from '../../attribute/Max.ts';
import type Min from '../../attribute/Min.ts';
import type ValidationMessageMax from '../../attribute/ValidationMessageMax.ts';
import type ValidationMessageMin from '../../attribute/ValidationMessageMin.ts';
import type ValidationMessageNoExist from '../../attribute/ValidationMessageNoExist.ts';
import { validate } from '../util.ts';

/**
 * `submit` event
 *
 * @param ev - SubmitEvent
 * @param data - Elements, attributes and others
 * @param data.inputElement - HTMLInputElement
 * @param data.min - Min
 * @param data.max - Max
 * @param data.validationMessageNoExist - ValidationMessageNoExist
 * @param data.validationMessageMin - ValidationMessageMin
 * @param data.validationMessageMax - ValidationMessageMax
 */
export default (
	ev: SubmitEvent,
	data: Readonly<{
		inputElement: HTMLInputElement;
		min: Min;
		max: Max;
		validationMessageNoExist: ValidationMessageNoExist;
		validationMessageMin: ValidationMessageMin;
		validationMessageMax: ValidationMessageMax;
	}>,
): void => {
	if (
		!validate(data.inputElement, {
			min: data.min,
			max: data.max,
			validationMessageNoExist: data.validationMessageNoExist,
			validationMessageMin: data.validationMessageMin,
			validationMessageMax: data.validationMessageMax,
		})
	) {
		ev.preventDefault();
	}
};
