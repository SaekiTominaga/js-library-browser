/**
 * `data-validation-message-isbn-checkdigit` attribute
 */
export default class {
	readonly #value: string;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `data-validation-message-isbn-checkdigit` attribute is not set');
		}

		this.#value = value;
	}

	get value(): string {
		return this.#value;
	}
}
