/**
 * `data-ignore` attribute
 */
export default class {
	readonly #selectors: string | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		this.#selectors = value;
	}

	get selectors(): string | undefined {
		return this.#selectors;
	}
}
