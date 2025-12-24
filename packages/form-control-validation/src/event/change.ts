import type ErrorMessage from '../attribute/ErrorMessage.ts';

/**
 * `change` event
 *
 * @param _ev - Event
 * @param data - Elements, attributes and another data
 * @param data.targetElement -
 * @param data.formControlElements -
 */
export default (
	_ev: Event,
	data: Readonly<{
		targetElement: HTMLElement;
		formControlElements: readonly (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
		errorMessage: ErrorMessage;
	}>,
): void => {
	/* エラー情報をいったんクリア */
	data.targetElement.setAttribute('aria-invalid', 'false');

	data.formControlElements.forEach((formControlElement) => {
		formControlElement.setCustomValidity('');
	});

	data.errorMessage.element.hidden = true;
	data.errorMessage.element.textContent = '';

	/* エラー情報を設定 */
	data.formControlElements.forEach((formControlElement) => {
		if (!formControlElement.validity.valid) {
			formControlElement.dispatchEvent(new Event('invalid'));
		}
	});
};
