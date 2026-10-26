type State = 'open' | 'closed';

export interface ToggleEventDetail {
	newState: State;
	eventType: string;
}

/**
 * Popover
 */
export default class extends HTMLElement {
	/* Elements */
	readonly #$content: HTMLElement;
	readonly #$hideButton: HTMLButtonElement;

	/* etc */
	#state: State | undefined; // test で使用（JSDOM が `:popover-open` 疑似クラスに対応したら不要になる https://github.com/jsdom/jsdom/issues/3721 ）

	constructor() {
		super();

		const htmlString = `
			<div part="content">
				<slot name="content"></slot>
				<button type="button" popovertargetaction="hide" part="hide-button">
					<slot name="hide-button"></slot>
				</button>
			</div>
		`;

		const cssString = `
			:host {
			}

			[part~="content"] {
			}

			[part~="hide-button"] {
				display: inline flex;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.setHTMLUnsafe(htmlString);

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);

		this.#$content = shadow.querySelector('[part="content"]')!;
		this.#$hideButton = shadow.querySelector('button[part="hide-button"]')!;
	}

	connectedCallback(): void {
		this.popover = '';
		this.#$hideButton.popoverTargetElement = this;

		/* ポップオーバー状態変化 */
		this.addEventListener('my-toggle', this.#customToggleEvent as (ev: Event) => void, { passive: true });
	}

	disconnectedCallback(): void {
		/* ポップオーバー状態変化 */
		this.removeEventListener('my-toggle', this.#customToggleEvent as (ev: Event) => void);
	}

	get state(): State | undefined {
		return this.#state;
	}

	/**
	 * ポップオーバーの表示／非表示状態が変化したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #customToggleEvent = (ev: CustomEvent<ToggleEventDetail>): void => {
		const { detail } = ev;

		switch (detail.newState) {
			case 'open': {
				this.showPopover();

				if (detail.eventType === 'click') {
					this.#$content.focus();
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
}
