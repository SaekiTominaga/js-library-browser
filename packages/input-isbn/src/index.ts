import InputIsbn from './InputIsbn.ts';

const validate = (element: Element): HTMLInputElement => {
	if (!(element instanceof HTMLInputElement)) {
		throw new Error('Element must be a `HTMLInputElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new InputIsbn(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			new InputIsbn(validate(element));
		});
	}
};
