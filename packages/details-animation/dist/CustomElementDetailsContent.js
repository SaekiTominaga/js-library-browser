import HTMLElementUtil, {} from './HTMLElementUtil.js';
/**
 * The additional information in a `<details>` element
 *
 * This is the same as `::details-content` pseudo-element <https://drafts.csswg.org/css-pseudo-4/#details-content-pseudo>
 */
export default class CustomElementDetailsContent extends HTMLElement {
    #writingMode;
    #animation;
    #animationOptions = {
        duration: 500,
        easing: 'ease',
    }; // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#parameters
    static get observedAttributes() {
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
        }
        else {
            /* adoptedStyleSheets 未対応環境 */
            shadow.innerHTML += `<style>${cssString}</style>`;
        }
    }
    connectedCallback() {
        this.#writingMode = new HTMLElementUtil(this).writingMode;
    }
    attributeChangedCallback(name, _oldValue, newValue) {
        switch (name) {
            case 'duration': {
                this.duration = newValue !== null ? Number(newValue) : null;
                break;
            }
            case 'easing': {
                this.easing = newValue;
                break;
            }
            default:
        }
    }
    get duration() {
        return this.#animationOptions.duration ?? null;
    }
    set duration(value) {
        if (value !== null) {
            this.#animationOptions.duration = value;
        }
        else {
            delete this.#animationOptions.duration;
        }
    }
    get easing() {
        return this.#animationOptions.easing ?? null;
    }
    set easing(value) {
        if (value !== null) {
            this.#animationOptions.easing = value;
        }
        else {
            delete this.#animationOptions.easing;
        }
    }
    get #blockSize() {
        return this.#writingMode === 'vertical' ? this.clientWidth : this.clientHeight;
    }
    get #scrollBlockSize() {
        return this.#writingMode === 'vertical' ? this.scrollWidth : this.scrollHeight;
    }
    /**
     * Open contents area
     */
    open() {
        let startSize = 0;
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
    close() {
        if (this.#animation?.playState === 'running') {
            /* アニメーションが終わらないうちに連続して `<summary>` 要素がクリックされた場合 */
            this.#animationCancel();
        }
        this.#animate('close', {
            startSize: this.#blockSize,
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
    #animate(orientation, animation) {
        const animationOptions = { ...this.#animationOptions };
        if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
            animationOptions.duration = 0;
        }
        this.#animation = this.animate({
            [this.#writingMode === 'vertical' ? 'width' : 'height']: [`${String(animation.startSize ?? 0)}px`, `${String(animation.endSize ?? 0)}px`],
        }, animationOptions);
        this.#animation.addEventListener('finish', () => {
            this.#clearStyles();
            const eventDetail = {
                orientation: orientation,
            };
            this.dispatchEvent(new CustomEvent('animation-finish', {
                detail: eventDetail,
            }));
        }, { passive: true, once: true });
    }
    /**
     * Cancel animation
     */
    #animationCancel() {
        this.#animation?.commitStyles();
        this.#animation?.cancel();
    }
    /**
     * Clear styles set by `Animation.commitStyles()`.
     */
    #clearStyles() {
        this.removeAttribute('style');
    }
}
//# sourceMappingURL=CustomElementDetailsContent.js.map