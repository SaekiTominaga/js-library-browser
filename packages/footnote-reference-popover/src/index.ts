import footnoteReferencePopover from './footnoteReferencePopover.ts';

const validate = (element: Element): HTMLAnchorElement => {
	if (!(element instanceof HTMLAnchorElement)) {
		throw new TypeError('Element must be a `HTMLAnchorElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (!CSS.supports('anchor-name: --x')) {
		console.info('This browser does not support CSS anchor positioning.');
		return;
	}

	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		footnoteReferencePopover(validate(elementOrElements));
	} else {
		[...elementOrElements].forEach((element) => {
			footnoteReferencePopover(validate(element));
		});
	}
};
