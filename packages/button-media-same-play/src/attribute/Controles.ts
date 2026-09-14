/**
 * `aria-controls` attribute
 */
export default class {
	readonly #elements: HTMLMediaElement[];

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `aria-controls` attribute is not set');
		}

		this.#elements = value.split(' ').map((id): HTMLMediaElement => {
			const element = document.querySelector(`#${CSS.escape(id)}`);
			if (element === null) {
				throw new Error(`Element \`#${id}\` not found`);
			}
			if (!(element instanceof HTMLMediaElement)) {
				throw new TypeError(`Element \`#${id}\` is not a \`HTMLMediaElement\``);
			}

			return element;
		});
	}

	get elements(): HTMLMediaElement[] {
		return this.#elements;
	}
}
