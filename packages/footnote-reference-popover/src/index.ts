import footnoteReferencePopover from './footnoteReferencePopover.ts';

const validate = (element: Element): HTMLAnchorElement => {
	if (!(element instanceof HTMLAnchorElement)) {
		throw new Error('Element must be a `HTMLAnchorElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		footnoteReferencePopover(validate(elementOrElements));
	} else {
		Array.from(elementOrElements).forEach((element) => {
			footnoteReferencePopover(validate(element));
		});
	}
};
