import detailsAnimation from './detailsAnimation.ts';

const validate = (element: Element): HTMLDetailsElement => {
	if (!(element instanceof HTMLDetailsElement)) {
		throw new Error('Element must be a `HTMLDetailsElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		detailsAnimation(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			detailsAnimation(validate(element));
		});
	}
};
