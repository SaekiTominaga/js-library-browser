import type { HTMLInputFileElement } from '../@types/lib.dom.d.ts';
import InputFilePreview from './InputFilePreview.ts';

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
		new InputFilePreview(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			new InputFilePreview(validate(element));
		});
	}
};
