import type ErrorMessage from '../attribute/ErrorMessage.ts';
import type Title from '../attribute/Title.ts';

/**
 * `invalid` event
 *
 * @param ev - Event
 * @param data - Elements, attributes and another data
 * @param data.targetElement -
 * @param data.formControlElements -
 */
export default (
	ev: Event,
	data: Readonly<{
		targetElement: HTMLElement;
		formControlElements: readonly (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[];
		errorMessage: ErrorMessage;
		title: Title;
	}>,
): void => {
	const targetElement = ev.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

	/* バリデーション文言を設定する */
	const getMessage = (formControlElement: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string => {
		const { validity } = formControlElement;
		if (!validity.valueMissing) {
			if (validity.patternMismatch && data.title.value !== undefined) {
				/* `title` 属性が設定されている場合 */
				return data.title.value;
			}
		}

		return formControlElement.validationMessage; // ブラウザのデフォルトメッセージ;
	};
	const message = getMessage(targetElement);

	/* エラー情報を設定 */
	data.targetElement.setAttribute('aria-invalid', 'true');

	data.formControlElements.forEach((formControlElement) => {
		formControlElement.setCustomValidity(message);
	});

	data.errorMessage.element.hidden = false;
	data.errorMessage.element.textContent = message;

	ev.preventDefault();
};
