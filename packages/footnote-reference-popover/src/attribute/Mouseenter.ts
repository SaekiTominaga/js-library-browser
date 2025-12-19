/**
 * `data-mouseenter-delay` attribute
 */
export default class {
	readonly #delay: number;

	/**
	 * @param value - Attribute value
	 * @param value.delay - `data-mouseenter-delay`
	 */
	constructor(value: Readonly<{ delay: string }>) {
		const delay = Number(value.delay);

		if (!Number.isFinite(delay)) {
			throw new TypeError('The value of the `data-mouseenter-delay` attribute must be a number.');
		}
		if (delay <= 0) {
			throw new TypeError('The value of the `data-mouseenter-delay` attribute must be a number greater than zero.');
		}

		this.#delay = delay;
	}

	get delay(): number {
		return this.#delay;
	}
}
