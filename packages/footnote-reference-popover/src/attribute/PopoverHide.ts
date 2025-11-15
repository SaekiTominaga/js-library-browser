/**
 * `data-popover-hide-text`, `data-popover-hide-image-src`, `data-popover-hide-image-width` and `data-popover-hide-image-height` attribute
 */
export default class {
	readonly #text: string | undefined;

	readonly #imageSrc: string | undefined;

	readonly #imageWidth: number | undefined;

	readonly #imageHeight: number | undefined;

	/**
	 * @param value - Attribute value
	 * @param value.text - `data-popover-hide-text`
	 * @param value.imageSrc - `data-popover-hide-image-src`
	 * @param value.imageWidth - `data-popover-hide-image-width`
	 * @param value.imageHeight - `data-popover-hide-image-height`
	 */
	constructor(
		value: Readonly<{
			text?: string | null | undefined;
			imageSrc?: string | null | undefined;
			imageWidth?: string | null | undefined;
			imageHeight?: string | null | undefined;
		}>,
	) {
		if (value.text !== null && value.text !== undefined) {
			this.#text = value.text;
		}

		if (value.imageSrc !== null && value.imageSrc !== undefined) {
			this.#imageSrc = value.imageSrc;
		}

		if (value.imageWidth !== null && value.imageWidth !== undefined) {
			const width = Number(value.imageWidth);

			if (!Number.isFinite(width)) {
				throw new TypeError('The value of the `data-popover-hide-image-width` attribute must be a number.');
			}
			if (width <= 0) {
				throw new TypeError('The value of the `data-popover-hide-image-width` attribute must be a number greater than zero.');
			}

			this.#imageWidth = width;
		}

		if (value.imageHeight !== null && value.imageHeight !== undefined) {
			const height = Number(value.imageHeight);

			if (!Number.isFinite(height)) {
				throw new TypeError('The value of the `data-popover-hide-image-height` attribute must be a number.');
			}
			if (height <= 0) {
				throw new TypeError('The value of the `data-popover-hide-image-height` attribute must be a number greater than zero.');
			}

			this.#imageHeight = height;
		}
	}

	get text(): string | undefined {
		return this.#text;
	}

	get imageSrc(): string | undefined {
		return this.#imageSrc;
	}

	get imageWidth(): number | undefined {
		return this.#imageWidth;
	}

	get imageHeight(): number | undefined {
		return this.#imageHeight;
	}
}
