/**
 * `data-validation-noexist` attribute
 */
export default class {
	readonly #value: string | undefined;

	/**
	 * @param value - Attribute value
	 * @param element - `<input>`
	 */
	constructor(value: string | null | undefined, element: HTMLInputElement) {
		if (element.max !== '') {
			if (value === null || value === undefined) {
				throw new TypeError('The `data-validation-max` attribute is not set');
			}
			this.#value = value;
		}
	}

	get value(): string | undefined {
		return this.#value;
	}
}
