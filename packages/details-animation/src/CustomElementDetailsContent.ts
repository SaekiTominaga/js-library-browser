import HTMLElementUtil, { type WritingMode } from './HTMLElementUtil.js';

type StateOrientation = 'open' | 'close';

export interface AnimationFinishEventDetail {
	orientation: StateOrientation;
}

/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
	#writingMode: WritingMode | undefined;

	#animation: Animation | null = null;

	readonly #animationOptions: KeyframeAnimationOptions = {
		duration: 500,
		easing: 'ease',
	}; // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#parameters

	static get observedAttributes(): string[] {
		return ['duration', 'easing'];
	}

	constructor() {
		super();

		const cssString = `
			:host {
				display: block flow;
				overflow: hidden;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.innerHTML = `
			<slot></slot>
		`;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (shadow.adoptedStyleSheets !== undefined) {
			const cssStyleSheet = new CSSStyleSheet();
			cssStyleSheet.replaceSync(cssString);

			shadow.adoptedStyleSheets = [cssStyleSheet];
		} else {
			/* adoptedStyleSheets 未対応環境 */
			shadow.innerHTML += `<style>${cssString}</style>`;
		}
	}

	connectedCallback(): void {
		this.#writingMode = new HTMLElementUtil(this).writingMode;
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		if (newValue !== null) {
			switch (name) {
				case 'duration': {
					this.duration = Number(newValue);
					break;
				}
				case 'easing': {
					this.easing = newValue;
					break;
				}
				default:
			}
		}
	}

	get duration(): number | CSSNumericValue | string | undefined {
		return this.#animationOptions.duration;
	}

	set duration(value: number) {
		this.#animationOptions.duration = value;
	}

	get easing(): string | undefined {
		return this.#animationOptions.easing;
	}

	set easing(value: string) {
		this.#animationOptions.easing = value;
	}

	get #blockSize(): number {
		return this.#writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
	}

	get #scrollBlockSize(): number {
		return this.#writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
	}

	/**
	 * Open contents area
	 */
	open(): void {
		let startSize = 0;
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();

			startSize = this.#blockSize;
		}

		this.#animate('open', {
			startSize: startSize,
			endSize: this.#scrollBlockSize,
			options: this.#animationOptions,
		});
	}

	/**
	 * Close contents area
	 */
	close(): void {
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();
		}

		this.#animate('close', {
			startSize: this.#blockSize,
			options: this.#animationOptions,
		});
	}

	/**
	 * Apply animation
	 *
	 * @param orientation - Orientation of state
	 * @param animation - Animation settings
	 * @param animation.startSize - Block size of the start of the animation
	 * @param animation.endSize - Block size of the end of the animation
	 * @param animation.options - KeyframeAnimationOptions
	 */
	#animate(orientation: StateOrientation, animation: { startSize?: number; endSize?: number; options: KeyframeAnimationOptions }): void {
		this.#animation = this.animate(
			{
				[this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
			},
			animation.options,
		);

		this.#animation.addEventListener(
			'finish',
			() => {
				this.#clearStyles();

				const eventDetail: AnimationFinishEventDetail = {
					orientation: orientation,
				};
				this.dispatchEvent(
					new CustomEvent('animation-finish', {
						detail: eventDetail,
					}),
				);
			},
			{ passive: true, once: true },
		);
	}

	/**
	 * Cancel animation
	 */
	#animationCancel(): void {
		this.#animation?.commitStyles();
		this.#animation?.cancel();
	}

	/**
	 * Clear styles set by `Animation.commitStyles()`.
	 */
	#clearStyles(): void {
		this.removeAttribute('style');
	}
}
