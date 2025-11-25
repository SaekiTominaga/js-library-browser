import TextareaAutoSize from './TextareaAutoSize.ts';

const validate = (element: Element): HTMLTextAreaElement => {
	if (!(element instanceof HTMLTextAreaElement)) {
		throw new Error('Element must be a `HTMLTextAreaElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		new TextareaAutoSize(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			new TextareaAutoSize(validate(element));
		});
	}
};
