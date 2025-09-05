import FormControlValidation from './FormControlValidation.ts';

const validate = (element: Element): HTMLElement => {
	if (!(element instanceof HTMLElement)) {
		throw new Error('Element must be a `HTMLElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new FormControlValidation(validate(elementOrElements));
	} else {
		for (const element of elementOrElements) {
			new FormControlValidation(validate(element));
		}
	}
};
