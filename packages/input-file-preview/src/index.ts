import type { HTMLInputFileElement } from '../@types/lib.dom.d.ts';
import inputFilePreview from './inputFilePreview.ts';

const validate = (element: Element): HTMLInputFileElement => {
	if (!(element instanceof HTMLInputElement)) {
		throw new Error('Element must be a `HTMLInputElement`');
	}
	if (element.type !== 'file') {
		throw new Error('Element must be a `<input type=file>`');
	}

	return element as HTMLInputFileElement;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		inputFilePreview(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			inputFilePreview(validate(element));
		});
	}
};
