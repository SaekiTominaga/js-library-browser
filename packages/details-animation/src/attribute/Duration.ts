/**
 * `duration` value
 */
export default class {
	readonly #value: number | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null) {
		if (value === null) {
			return;
		}

		const valueNumber = Number(value);

		if (!Number.isFinite(valueNumber)) {
			throw new TypeError('The value of the `data-duration` attribute must be a number.');
		}
		if (valueNumber < 0) {
			throw new TypeError('The value of the `data-duration` attribute must be a positive number.');
		}

		this.#value = valueNumber;
	}

	get value(): number | undefined {
		return this.#value;
	}
}
