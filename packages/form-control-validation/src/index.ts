import formControlValidation from './formControlValidation.ts';

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
		formControlValidation(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			formControlValidation(validate(element));
		});
	}
};
