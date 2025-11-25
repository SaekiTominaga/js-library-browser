import FormBeforeUnloadConfirm from './FormBeforeUnloadConfirm.ts';

const validate = (element: Element): HTMLFormElement => {
	if (!(element instanceof HTMLFormElement)) {
		throw new Error('Element must be a `HTMLFormElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new FormBeforeUnloadConfirm(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			new FormBeforeUnloadConfirm(validate(element));
		});
	}
};
