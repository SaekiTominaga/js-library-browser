/**
 * `data-text` or `data-target` attribute
 */
export default class {
	readonly #text: string | undefined;

	readonly #$element: HTMLElement | undefined;

	/**
	 * @param value - Attribute value
	 * @param value.text - `data-text`
	 * @param value.element - `data-target`
	 */
	constructor(value: Readonly<{ text?: string | undefined; element?: string | undefined }>) {
		if (value.text === undefined && value.element === undefined) {
			throw new TypeError('The `data-text` or `data-target` attribute is not set');
		}

		this.#text = value.text;

		if (value.element !== undefined) {
			const $target = document.querySelector<HTMLElement>(`#${value.element}`);
			if ($target === null) {
				throw new Error(`Element \`#${value.element}\` not found`);
			}

			this.#$element = $target;
		}
	}

	get text(): string | undefined {
		return this.#text;
	}

	get $element(): HTMLElement | undefined {
		return this.#$element;
	}
}
