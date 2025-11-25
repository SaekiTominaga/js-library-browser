import ButtonShare from './ButtonShare.ts';

const validate = (element: Element): HTMLButtonElement => {
	if (!(element instanceof HTMLButtonElement)) {
		throw new Error('Element must be a `HTMLButtonElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new ButtonShare(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			new ButtonShare(validate(element));
		});
	}
};
