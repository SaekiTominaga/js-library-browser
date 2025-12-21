/**
 * `aria-controls` attribute
 */
export default class {
	readonly #elements: HTMLMediaElement[] = [];

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `aria-controls` attribute is not set.');
		}

		value.split(' ').forEach((id) => {
			const element = document.getElementById(id);
			if (element === null) {
				throw new Error(`Element \`#${id}\` not found.`);
			}
			if (!(element instanceof HTMLMediaElement)) {
				throw new Error(`Element \`#${id}\` is not a \`HTMLMediaElement\`.`);
			}

			this.#elements.push(element);
		});
	}

	get elements(): HTMLMediaElement[] {
		return this.#elements;
	}
}
