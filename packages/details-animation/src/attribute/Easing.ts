type CubicBezierEasingKeywordValue = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
type StepEasingKeywordValue = 'step-start' | 'step-end';
type EasingKeywordValue = 'linear' | CubicBezierEasingKeywordValue | StepEasingKeywordValue;

/**
 * `data-easing` attribute
 */
export default class {
	readonly #value: EasingKeywordValue | undefined;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			return;
		}

		if (!['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier', 'step-start', 'step-end', 'steps'].includes(value)) {
			throw new TypeError(
				'The value of the `data-easing` attribute must be "linear", "ease", "ease-in", "ease-out", "ease-in-out", "cubic-bezier", "step-start", "step-end", or "steps"',
			);
		}

		this.#value = value as EasingKeywordValue;
	}

	get value(): EasingKeywordValue | undefined {
		return this.#value;
	}
}
