type Value = 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr';

export default class {
	readonly #writingMode: Value;

	/**
	 * @param element - Target element
	 */
	constructor(element: HTMLElement) {
		const { writingMode } = getComputedStyle(element);

		switch (writingMode) {
			case 'horizontal-tb':
			case 'vertical-rl':
			case 'vertical-lr':
			case 'sideways-rl':
			case 'sideways-lr': {
				this.#writingMode = writingMode;
				break;
			}
			default: {
				throw new Error(`Unexpected \`writing-mode\` value: ${writingMode}`);
			}
		}
	}

	/**
	 * Get the value of `writing-mode`
	 *
	 * @returns The value of `writing-mode`
	 */
	get value(): Value {
		return this.#writingMode;
	}

	/**
	 * Whether the element is horizontal or not
	 *
	 * @returns true if horizontal
	 */
	isHorizontal(): boolean {
		switch (this.#writingMode) {
			case 'horizontal-tb': {
				return true;
			}
			default:
		}

		return false;
	}

	/**
	 * Whether the element is vertical or not
	 *
	 * @returns true if vertical
	 */
	isVertical(): boolean {
		switch (this.#writingMode) {
			case 'vertical-rl':
			case 'vertical-lr':
			case 'sideways-rl':
			case 'sideways-lr': {
				return true;
			}
			default:
		}

		return false;
	}
}
