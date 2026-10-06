import { parseDuration } from '../util/cssUnits.ts';

/**
 * `data-feedback` attribute
 */
export default class {
	readonly #$element: HTMLOutputElement | undefined;

	readonly #text: string | undefined;

	readonly #duration: number | undefined;

	/**
	 * @param value - Attribute value
	 * @param value.element - `data-feedbacked-by`
	 * @param value.text - `data-feedback-text`
	 * @param value.duration - `data-feedback-duration`
	 */
	constructor(value: Readonly<{ element?: string | undefined; text?: string | undefined; duration?: string | undefined }>) {
		if (value.element === undefined || value.text === undefined) {
			return;
		}

		const $feedback = document.querySelector(`#${value.element}`);
		if ($feedback === null) {
			throw new Error(`Element \`#${value.element}\` not found`);
		}
		if (!($feedback instanceof HTMLOutputElement)) {
			throw new TypeError(`Element \`#${value.element}\` must be a \`HTMLOutputElement\``);
		}

		this.#$element = $feedback;
		this.#text = value.text;
		this.#duration = value.duration !== undefined ? parseDuration(value.duration) : undefined;
	}

	get $element(): HTMLOutputElement | undefined {
		return this.#$element;
	}

	get text(): string | undefined {
		return this.#text;
	}

	get duration(): number | undefined {
		return this.#duration;
	}
}
