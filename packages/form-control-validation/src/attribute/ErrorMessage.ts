import { allowAlertRole } from '../util/element.ts';

/**
 * `aria-errormessage` attribute
 */
export default class {
	readonly #element: HTMLElement;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `aria-errormessage` attribute is not set');
		}

		const element = document.querySelector<HTMLElement>(`#${value}`);
		if (element === null) {
			throw new Error(`Element \`#${value}\` not found`);
		}

		if (!allowAlertRole(element)) {
			throw new TypeError(`Element \`#${value}\` cannot set \`role=alert\` or cannot set a error message using \`textContent\` property`);
		}

		this.#element = element;
	}

	get element(): HTMLElement {
		return this.#element;
	}
}
