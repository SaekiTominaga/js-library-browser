/**
 * `min` attribute
 */
export default class {
	readonly #value: Date | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined || value === '') {
			return;
		}

		if (!/[0-9]{4}-[0-9]{2}-[0-9]{2}/u.test(value)) {
			throw new TypeError('The format of the `min` attribute must be `YYYY-MM-DD`.');
		}

		this.#value = new Date(Number(value.substring(0, 4)), Number(value.substring(5, 7)) - 1, Number(value.substring(8, 10)));
	}

	get value(): Date | undefined {
		return this.#value;
	}
}
