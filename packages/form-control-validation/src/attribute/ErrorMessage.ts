/**
 * `aria-errormessage` attribute
 */
export default class {
	readonly #element: HTMLElement;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `aria-errormessage` attribute is not set');
		}

		const element = document.getElementById(value);
		if (element === null) {
			throw new Error(`Element \`#${value}\` not found`);
		}

		this.#element = element;
	}

	get element(): HTMLElement {
		return this.#element;
	}
}
