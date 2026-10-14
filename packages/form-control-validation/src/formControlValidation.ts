import ErrorMessage from './attribute/ErrorMessage.ts';
import Title from './attribute/Title.ts';
import changeEvent from './event/change.ts';
import invalidEvent from './event/invalid.ts';

const getFormControlElements = ($target: HTMLElement): readonly (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)[] => {
	if ($target instanceof HTMLInputElement || $target instanceof HTMLSelectElement || $target instanceof HTMLTextAreaElement) {
		return [$target];
	}
	if ($target.getAttribute('role') === 'radiogroup') {
		return [...$target.querySelectorAll<HTMLInputElement>('input[type="radio"]')];
	}

	throw new Error('The `formControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`');
};

const getLabels = ($target: HTMLElement): readonly Element[] | undefined => {
	const { ariaLabelledByElements } = $target;
	if (ariaLabelledByElements !== null) {
		return ariaLabelledByElements;
	}

	if ($target instanceof HTMLInputElement) {
		return $target.labels !== null ? [...$target.labels] : undefined;
	}
	if ($target instanceof HTMLSelectElement || $target instanceof HTMLTextAreaElement) {
		return [...$target.labels];
	}

	return undefined;
};

/**
 * Input validation of form control
 *
 * @param $this - Target element
 */
export default ($this: HTMLElement): void => {
	const titleAttribute = $this.getAttribute('title');
	const ariaErrormessageAttribute = $this.getAttribute('aria-errormessage');

	const title = new Title(titleAttribute);
	const errorMessage = new ErrorMessage(ariaErrormessageAttribute);

	const $$labels = getLabels($this);

	const $errorMessage = errorMessage.element;
	$errorMessage.hidden = true;
	$errorMessage.role = 'alert';
	if ($$labels !== undefined) {
		$errorMessage.ariaLabelledByElements = [...$$labels, $errorMessage];
	}

	const $$formControls = getFormControlElements($this); // フォームコントロール要素

	$$formControls.forEach(($formControl) => {
		$formControl.addEventListener(
			'change',
			(ev: Event) => {
				changeEvent(ev, {
					targetElement: $this,
					formControlElements: $$formControls,
					errorMessage: errorMessage,
				});
			},
			{ passive: true },
		);
		$formControl.addEventListener('invalid', (ev: Event) => {
			invalidEvent(ev, {
				targetElement: $this,
				formControlElements: $$formControls,
				errorMessage: errorMessage,
				title: title,
			});
		});
	});
};
