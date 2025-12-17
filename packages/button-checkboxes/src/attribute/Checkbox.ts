/**
 * `data-control` or `data-controls-class` or `data-controls-name` attribute
 */
export default class {
	readonly #elements: HTMLInputElement[] = [];

	/**
	 * @param value - Attribute value
	 * @param value.id - `data-control`
	 * @param value.class - `data-controls-class`
	 * @param value.name - `data-controls-name`
	 */
	constructor(value: Readonly<{ id?: string | null | undefined; class?: string | null | undefined; name?: string | null | undefined }>) {
		if (
			(value.id === null || value.id === undefined) &&
			(value.class === null || value.class === undefined) &&
			(value.name === null || value.name === undefined)
		) {
			throw new TypeError('The `data-control` or `data-controls-class` or `data-controls-name` attribute is not set.');
		}

		if (value.id !== null && value.id !== undefined) {
			const checkboxGroupElement = document.getElementById(value.id);
			if (checkboxGroupElement === null) {
				throw new Error(`Element \`#${value.id}\` not found.`);
			}

			const checkboxElements = [...checkboxGroupElement.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
			if (checkboxElements.length === 0) {
				throw new Error(`Checkbox does not exist in descendants of the element \`#${value.id}\`.`);
			}

			this.#elements = this.#elements.concat(checkboxElements);
		}

		if (value.class !== null && value.class !== undefined) {
			const elements = [...document.getElementsByClassName(value.class)];
			if (elements.length === 0) {
				throw new Error(`Element \`.${value.class}\` not found.`);
			}
			if (!elements.every((element) => element instanceof HTMLInputElement)) {
				throw new Error(`Element \`.${value.class}\` is not a \`HTMLInputElement\`.`);
			}

			this.#elements = this.#elements.concat(elements);
		}

		if (value.name !== null && value.name !== undefined) {
			const elements = [...document.getElementsByName(value.name)];
			if (elements.length === 0) {
				throw new Error(`Element \`[name=${value.name}]\` not found.`);
			}
			if (!elements.every((element) => element instanceof HTMLInputElement)) {
				throw new Error(`Element \`[name=${value.name}]\` is not a \`HTMLInputElement\`.`);
			}

			this.#elements = this.#elements.concat(elements);
		}
	}

	get elements(): HTMLInputElement[] {
		return this.#elements;
	}
}
