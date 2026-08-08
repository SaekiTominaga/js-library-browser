/**
 * `data-overlayed-by` attribute
 */
export default class {
	readonly #element: HTMLDialogElement;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `data-overlayed-by` attribute is not set');
		}

		const element = document.getElementById(value);
		if (element === null) {
			throw new Error(`Element \`#${value}\` not found.`);
		}
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error(`Element \`#${value}\` must be a \`<dialog>\` element.`);
		}

		this.#element = element;
	}

	get element(): HTMLDialogElement {
		return this.#element;
	}
}
