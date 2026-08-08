/**
 * `data-message` attribute
 */
export default class {
	readonly #text: string;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `data-message` attribute is not set');
		}

		this.#text = value;
	}

	get text(): string {
		return this.#text;
	}
}
