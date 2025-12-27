import ValidationMessageIsbnCheckdigit from './attribute/ValidationMessageIsbnCheckdigit.ts';
import formSubmitEvent from './event/form/submit.ts';
import changeEvent from './event/change.ts';

/**
 * ISBN input field
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLInputElement): void => {
	const { validationMessageIsbnCheckdigit: validationMessageIsbnCheckdigitAttribute } = thisElement.dataset;

	const validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(validationMessageIsbnCheckdigitAttribute);

	thisElement.minLength = 10;
	thisElement.maxLength = 17;
	thisElement.pattern = '(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]';

	thisElement.addEventListener(
		'change',
		(ev: Event) => {
			changeEvent(ev, {
				validationMessageIsbnCheckdigit: validationMessageIsbnCheckdigit,
			});
		},
		{ passive: true },
	);

	thisElement.form?.addEventListener('submit', (ev: SubmitEvent) => {
		formSubmitEvent(ev, {
			inputElement: thisElement,
			validationMessageIsbnCheckdigit: validationMessageIsbnCheckdigit,
		});
	});
};
