import buttonCheckboxes from './buttonCheckboxes.ts';

const validate = (element: Element): HTMLButtonElement => {
	if (!(element instanceof HTMLButtonElement)) {
		throw new TypeError('Element must be a `HTMLButtonElement`');
	}

	return element;
};

export default (elementOrElements: NodeListOf<Element> | HTMLCollectionOf<Element> | Element | null): void => {
	if (!('ariaControlsElements' in Element.prototype)) {
		console.info('This browser does not support `ariaControlsElements` property.');
		return;
	}

	if (elementOrElements === null) {
		return;
	}

	if (elementOrElements instanceof Element) {
		buttonCheckboxes(validate(elementOrElements));
	} else {
		[...elementOrElements].forEach((element) => {
			buttonCheckboxes(validate(element));
		});
	}
};
