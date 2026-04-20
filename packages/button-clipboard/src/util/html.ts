/**
 * Get the content of a HTMLElement
 *
 * @param element - HTML element
 *
 * @returns Content of a HTMLElement
 */
export const getContent = (element: HTMLElement): string => {
	if (element instanceof HTMLAreaElement || element instanceof HTMLImageElement) {
		return element.alt;
	}
	if (
		element instanceof HTMLInputElement ||
		element instanceof HTMLOptionElement ||
		element instanceof HTMLSelectElement ||
		element instanceof HTMLTextAreaElement ||
		element instanceof HTMLOutputElement
	) {
		return element.value;
	}
	if (element instanceof HTMLMetaElement) {
		return element.content;
	}
	if (element instanceof HTMLMeterElement || element instanceof HTMLProgressElement) {
		return String(element.value);
	}
	if (element instanceof HTMLPreElement) {
		return element.textContent;
	}

	return element.textContent.trim();
};
