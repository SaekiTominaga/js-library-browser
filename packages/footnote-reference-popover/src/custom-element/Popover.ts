type State = 'open' | 'closed';

export interface ToggleEventDetail {
	newState: State;
	eventType: string;
}

/**
 * Popover
 */
export default class extends HTMLElement {
	readonly #contentElement: HTMLElement;

	readonly #firstFocusableElement: HTMLElement;

	readonly #lastFocusableElement: HTMLElement;

	readonly #hideButtonElement: HTMLButtonElement;

	readonly #hideButtonTextElement: HTMLSpanElement;

	readonly #hideButtonImageElement: HTMLImageElement;

	readonly #HIDE_TEXT_INITIAL_VALUE = 'Close';

	#hideText = this.#HIDE_TEXT_INITIAL_VALUE;

	#mouseenterTimeoutId?: NodeJS.Timeout; // ポップオーバーを表示する際のタイマーの識別 ID（`clearTimeout()` で使用）

	#mouseleaveTimeoutId?: NodeJS.Timeout; // ポップオーバーを非表示にする際のタイマーの識別 ID（`clearTimeout()` で使用）

	#triggerElement: HTMLElement | undefined;

	#state: State | undefined; // test で使用（JSDOM が `:popover-open` 疑似クラスに対応したら不要になる https://github.com/jsdom/jsdom/issues/3721 ）

	static get observedAttributes(): string[] {
		return ['hide-text', 'hide-image-src', 'hide-image-width', 'hide-image-height'];
	}

	constructor() {
		super();

		const htmlString = `
			<span id="first-focusable" tabindex="0"></span>
			<div tabindex="-1" part="content">
				<slot></slot>
				<button type="button" popovertargetaction="hide" part="hide-button">
					<span part="hide-button-text"></span>
					<img part="hide-button-image" hidden="" /></span>
				</button>
			</div>
			<span id="last-focusable" tabindex="0"></span>
		`;

		const cssString = `
			:host {
				position: absolute;
				contain: layout;
				margin: 0;
				border: none;
				padding: 0;
				overflow: visible;
			}

			:host::part(content) {
				border: solid;
				padding: 0.25em;
			}

			:host::part(hide-button) {
				display: inline flex;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		'setHTMLUnsafe' in shadow ? shadow.setHTMLUnsafe(htmlString) : ((shadow as ShadowRoot).innerHTML = htmlString);

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);

		this.#contentElement = shadow.querySelector('[part="content"]')!;
		this.#hideButtonElement = shadow.querySelector('[part="hide-button"]')!;
		this.#hideButtonTextElement = shadow.querySelector('[part="hide-button-text"]')!;
		this.#hideButtonImageElement = shadow.querySelector('[part="hide-button-image"]')!;
		this.#firstFocusableElement = shadow.getElementById('first-focusable')!;
		this.#lastFocusableElement = shadow.getElementById('last-focusable')!;
	}

	connectedCallback(): void {
		this.popover = '';
		this.#hideButtonElement.popoverTargetElement = this;

		/* コピー元の HTML 中に `id` 属性が設定されていた場合、ページ中に ID が重複してしまうのを防ぐ */
		const hostElement = this.shadowRoot?.host;
		if (hostElement !== undefined) {
			hostElement.querySelectorAll('[id]').forEach((element) => {
				element.removeAttribute('id');
			});
		}

		/* ポップオーバー状態変化 */
		this.addEventListener('my-toggle', this.#customToggleEvent as (ev: Event) => void, { passive: true });

		/* 循環フォーカス */
		this.#firstFocusableElement.addEventListener('focus', this.#firstFocusableFocusEvent, { passive: true });
		this.#lastFocusableElement.addEventListener('focus', this.#lastFocusableFocusEvent, { passive: true });
	}

	disconnectedCallback(): void {
		/* ポップオーバー状態変化 */
		this.removeEventListener('my-toggle', this.#customToggleEvent as (ev: Event) => void);

		/* 循環フォーカス */
		this.#firstFocusableElement.removeEventListener('focus', this.#firstFocusableFocusEvent);
		this.#lastFocusableElement.removeEventListener('focus', this.#lastFocusableFocusEvent);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'hide-text': {
				this.hideText = newValue;
				break;
			}
			case 'hide-image-src': {
				this.hideImageSrc = newValue;
				break;
			}
			case 'hide-image-width': {
				this.hideImageWidth = Number(newValue);
				break;
			}
			case 'hide-image-height': {
				this.hideImageHeight = Number(newValue);
				break;
			}
			default:
		}
	}

	get hideText(): string {
		return this.#hideText;
	}

	set hideText(value: string | null) {
		this.#hideText = value ?? this.#HIDE_TEXT_INITIAL_VALUE;

		this.#hideButtonTextElement.textContent = this.#hideText;
		this.#hideButtonImageElement.alt = this.#hideText;
	}

	get hideImageSrc(): string {
		return this.#hideButtonImageElement.src;
	}

	set hideImageSrc(value: string | null) {
		if (value === null) {
			this.#hideButtonTextElement.hidden = false;
			this.#hideButtonImageElement.hidden = true;
			return;
		}

		this.#hideButtonTextElement.hidden = true;
		this.#hideButtonImageElement.src = value;
		this.#hideButtonImageElement.hidden = false;
	}

	get hideImageWidth(): number | null {
		return this.#hideButtonImageElement.width;
	}

	set hideImageWidth(value: number | null) {
		if (value === null) {
			this.#hideButtonImageElement.removeAttribute('width');
		}

		this.#hideButtonImageElement.width = value ?? 0;
	}

	get hideImageHeight(): number | null {
		return this.#hideButtonImageElement.height;
	}

	set hideImageHeight(value: number | null) {
		if (value === null) {
			this.#hideButtonImageElement.removeAttribute('height');
		}

		this.#hideButtonImageElement.height = value ?? 0;
	}

	get width(): number {
		return this.#contentElement.getBoundingClientRect().width;
	}

	get hideButtonElement(): HTMLButtonElement {
		return this.#hideButtonElement;
	}

	get triggerElement(): HTMLElement | undefined {
		return this.#triggerElement;
	}

	set triggerElement(triggerElement: HTMLElement | undefined) {
		this.#triggerElement = triggerElement;
	}

	get mouseenterTimeoutId(): NodeJS.Timeout | undefined {
		return this.#mouseenterTimeoutId;
	}

	set mouseenterTimeoutId(value: NodeJS.Timeout | undefined) {
		if (value !== undefined) {
			this.#mouseenterTimeoutId = value;
		}
	}

	get mouseleaveTimeoutId(): NodeJS.Timeout | undefined {
		return this.#mouseleaveTimeoutId;
	}

	set mouseleaveTimeoutId(value: NodeJS.Timeout | undefined) {
		if (value !== undefined) {
			this.#mouseleaveTimeoutId = value;
		}
	}

	get state(): State | undefined {
		return this.#state;
	}

	/**
	 * ポップオーバーの表示／非表示状態が変化したの処理
	 *
	 * @param ev - Event
	 */
	readonly #customToggleEvent = (ev: CustomEvent<ToggleEventDetail>): void => {
		const { detail } = ev;

		switch (detail.newState) {
			case 'open': {
				this.showPopover();

				if (detail.eventType === 'click') {
					this.#contentElement.focus();
				}

				break;
			}
			case 'closed': {
				this.hidePopover();

				break;
			}
			default:
		}

		this.#state = detail.newState;
	};

	/**
	 * 最初の循環フォーカス要素にフォーカスされたときの処理
	 */
	readonly #firstFocusableFocusEvent = (): void => {
		this.#hideButtonElement.focus();
	};

	/**
	 * 最後の循環フォーカス要素にフォーカスされたときの処理
	 */
	readonly #lastFocusableFocusEvent = (): void => {
		this.#contentElement.focus();
	};
}
