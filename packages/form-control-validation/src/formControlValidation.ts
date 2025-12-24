import ErrorMessage from './attribute/ErrorMessage.ts';
import Title from './attribute/Title.ts';
import changeEvent from './event/change.ts';
import invalidEvent from './event/invalid.ts';

/**
 * Input validation of form control
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLElement): void => {
	const titleAttribute = thisElement.getAttribute('title');
	const ariaErrormessageAttribute = thisElement.getAttribute('aria-errormessage');

	const title = new Title(titleAttribute);
	const errorMessage = new ErrorMessage(ariaErrormessageAttribute);
	errorMessage.element.setAttribute('role', 'alert');

	const getFormControlElements = (targetElement: HTMLElement): readonly (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] => {
		if (targetElement instanceof HTMLInputElement || targetElement instanceof HTMLSelectElement || targetElement instanceof HTMLTextAreaElement) {
			return [targetElement];
		}
		if (targetElement.getAttribute('role') === 'radiogroup') {
			return [...targetElement.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
		}

		throw new Error('The `formControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`.');
	};

	const formControlElements = getFormControlElements(thisElement); // フォームコントロール要素

	formControlElements.forEach((formControlElement) => {
		formControlElement.addEventListener(
			'change',
			(ev: Event) => {
				changeEvent(ev, {
					targetElement: thisElement,
					formControlElements: formControlElements,
					errorMessage: errorMessage,
				});
			},
			{ passive: true },
		);
		formControlElement.addEventListener('invalid', (ev: Event) => {
			invalidEvent(ev, {
				targetElement: thisElement,
				formControlElements: formControlElements,
				errorMessage: errorMessage,
				title: title,
			});
		});
	});
};
