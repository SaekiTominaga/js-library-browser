import shadowAppendCss from '@w0s/shadow-append-css';
import WritingMode from '@w0s/writing-mode';
import Duration from '../attribute/Duration.ts';
import Easing from '../attribute/Easing.ts';

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

	#animation: Animation | undefined;

	#duration: Duration | undefined;

	#easing: Easing | undefined;

	static get observedAttributes(): string[] {
		return ['duration', 'easing'];
	}

	constructor() {
		super();

		const htmlString = `
			<slot></slot>
		`;

		const cssString = `
			:host {
				display: block flow;
				overflow: hidden;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		'setHTMLUnsafe' in shadow ? shadow.setHTMLUnsafe(htmlString) : ((shadow as ShadowRoot).innerHTML = htmlString);
		shadowAppendCss(shadow, cssString);
	}

	connectedCallback(): void {
		try {
			this.#writingMode = new WritingMode(this);
		} catch (e) {
			/* TODO: jsdom は `getComputedStyle()` で CSS の継承を認識しない https://github.com/jsdom/jsdom/issues/2160 */
		}
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'duration': {
				this.duration = new Duration(newValue ?? undefined);
				break;
			}
			case 'easing': {
				this.easing = new Easing(newValue ?? undefined);
				break;
			}
			default:
		}
	}

	get duration(): Duration | undefined {
		return this.#duration;
	}

	set duration(duration: Duration | undefined) {
		this.#duration = duration;
	}

	get easing(): Easing | undefined {
		return this.#easing;
	}

	set easing(easing: Easing | undefined) {
		this.#easing = easing;
	}

	get #blockSize(): number | undefined {
		if (this.#writingMode === undefined) {
			return undefined;
		}

		return this.#writingMode.isHorizontal() ? this.clientHeight : this.clientWidth;
	}

	get #scrollBlockSize(): number | undefined {
		if (this.#writingMode === undefined) {
			return undefined;
		}

		return this.#writingMode.isHorizontal() ? this.scrollHeight : this.scrollWidth;
	}

	/**
	 * Open contents area
	 */
	open(): void {
		let startSize: number | undefined = 0;
		if (this.#animation?.playState === 'running') {
			/* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
			this.#animationCancel();

			startSize = this.#blockSize;
		}

		this.#animate('open', {
			startSize: startSize,
			endSize: this.#scrollBlockSize,
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
			endSize: 0,
		});
	}

	/**
	 * Apply animation
	 *
	 * @param orientation - Orientation of state
	 * @param animation - Animation settings
	 * @param animation.startSize - Block size of the start of the animation
	 * @param animation.endSize - Block size of the end of the animation
	 */
	#animate(
		orientation: StateOrientation,
		animation: Readonly<{
			startSize: number | undefined;
			endSize: number | undefined;
		}>,
	): void {
		if (window.matchMedia('(prefers-reduced-motion:reduce)').matches || animation.startSize === undefined || animation.endSize === undefined) {
			this.#duration = undefined;
		}

		const animationOptions: KeyframeAnimationOptions = {};
		if (this.#duration?.value !== undefined) {
			animationOptions.duration = this.#duration.value;
		}
		if (this.#easing?.value !== undefined) {
			animationOptions.easing = this.#easing.value;
		}

		this.#animation = this.animate(
			{
				[this.#writingMode?.isHorizontal() ? 'height' : 'width']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
			},
			animationOptions,
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
