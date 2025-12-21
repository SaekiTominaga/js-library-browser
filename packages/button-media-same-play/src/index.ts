import buttonMediaSamePlay from './buttonMediaSamePlay.ts';

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
		buttonMediaSamePlay(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			buttonMediaSamePlay(validate(element));
		});
	}
};
