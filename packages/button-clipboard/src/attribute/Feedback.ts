/**
 * `data-feedback` attribute
 */
export default class {
	readonly #element: HTMLElement | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value?: string | null) {
		if (value === null || value === undefined) {
			return;
		}

		const feedbackElement = document.getElementById(value);
		if (feedbackElement === null) {
			throw new Error(`Element \`#${value}\` not found.`);
		}

		this.#element = feedbackElement;
	}

	get element(): HTMLElement | undefined {
		return this.#element;
	}
}
