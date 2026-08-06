export const getTextWidth = ($element: HTMLElement): number => {
	const range = document.createRange();
	range.selectNodeContents($element);

	const rect = range.getBoundingClientRect();
	return rect.width;
};
