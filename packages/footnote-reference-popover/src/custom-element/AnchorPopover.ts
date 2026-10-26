import { parseDuration } from '../util/cssUnits.ts';
import PopoverElement, { type ToggleEventDetail } from './Popover.ts';

const popoverDelayMouseenterDefault = '250ms';
const popoverDelayMouseleaveDefault = '250ms';

export default class extends HTMLElement {
	/* Elements */
	#$anchor: HTMLAnchorElement | undefined;
	#$popover: PopoverElement | undefined;

	/* Attributes */
	#ignore: string | undefined;
	#popoverDelayMouseenter: string | undefined;
	#popoverDelayMouseleave: string | undefined;

	/* etc */
	readonly #shadow: ShadowRoot | undefined;
	#popoverTimeoutId?: NodeJS.Timeout; // ポップオーバーを表示する際のタイマーの識別 ID（`clearTimeout()` で使用）

	static get observedAttributes(): string[] {
		return ['ignore', 'popover-delay-mouseenter', 'popover-delay-mouseleave'];
	}

	constructor() {
		super();

		if (!CSS.supports('anchor-name: --x')) {
			console.info('This browser does not support CSS anchor positioning.');
			return;
		}

		const cssString = `
			[part~="anchor-wrapper"] {
				anchor-name: --footnote-reference;
				display: unset;
			}

			[part~="popover"] {
				position: absolute;
				position-anchor: --footnote-reference;
				position-area: block-end span-inline-end;
				position-try: flip-inline;
				container-type: anchored;

				@supports not (container-type: anchored) {
					position-try-order: most-inline-size;
				}
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		this.#shadow = shadow;

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);

		if (customElements.get('fn-popover') === undefined) {
			customElements.define('fn-popover', PopoverElement);
		}
	}

	connectedCallback(): void {
		const $anchor = this.querySelector<HTMLAnchorElement>('[slot="anchor__wrapper"] > a');
		if ($anchor === null) {
			throw new Error(`Elements with \`slot="anchor__wrapper"\` must contain a \`<a>\` element`);
		}
		$anchor.role = 'button';
		this.#$anchor = $anchor;

		const $popoverHideTemplate = this.querySelector<HTMLTemplateElement>('template[slot="popover__hide"]');

		const htmlString = `
			<span part="anchor-wrapper">
				<slot name="anchor__wrapper"></slot>
			</span>
			<fn-popover part="popover" exportparts="content:popover__content, hide-button:popover__hide-button">
				<div slot="content">${this.#getFootnote($anchor).innerHTML}</div>
				<span name="popover__hide" slot="hide-button">${$popoverHideTemplate?.innerHTML ?? 'Close'}</span>
			</fn-popover>
		`;

		this.#shadow?.setHTMLUnsafe(htmlString);

		this.#$popover = this.#shadow?.querySelector('[part="popover"]') ?? undefined;

		if (this.#$popover !== undefined) {
			this.#$popover.dataset['anchorInlineSize'] = String(this.#$anchor.getBoundingClientRect().width);
		}

		this.#$anchor.addEventListener('click', this.#anchorClickEvent);
		this.#$anchor.addEventListener('pointerenter', this.#anchorPointerenterEvent, { passive: true });
		this.#$anchor.addEventListener('pointerleave', this.#anchorPointerleaveEvent, { passive: true });

		this.#$popover?.addEventListener('pointerenter', this.#popoverPointerenterEvent, { passive: true });
		this.#$popover?.addEventListener('pointerleave', this.#popoverPointerleaveEvent, { passive: true });
		this.#$popover?.addEventListener('click', this.#popoverClickEvent, { passive: true });
	}

	disconnectedCallback(): void {
		this.#$anchor?.removeEventListener('click', this.#anchorClickEvent);
		this.#$anchor?.removeEventListener('pointerenter', this.#anchorPointerenterEvent);
		this.#$anchor?.removeEventListener('pointerleave', this.#anchorPointerleaveEvent);

		this.#$popover?.removeEventListener('pointerenter', this.#popoverPointerenterEvent);
		this.#$popover?.removeEventListener('pointerleave', this.#popoverPointerleaveEvent);
		this.#$popover?.removeEventListener('click', this.#popoverClickEvent);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'ignore': {
				this.#ignore = newValue ?? undefined;
				break;
			}
			case 'popover-delay-mouseenter': {
				this.#popoverDelayMouseenter = newValue ?? undefined;
				break;
			}
			case 'popover-delay-mouseleave': {
				this.#popoverDelayMouseleave = newValue ?? undefined;
				break;
			}
			default:
		}
	}

	get ignore(): string | undefined {
		return this.#ignore;
	}

	set ignore(value: string | undefined) {
		this.#ignore = value;
	}

	get popoverDelayMouseenter(): string | undefined {
		return this.#popoverDelayMouseenter;
	}

	set popoverDelayMouseenter(value: string | undefined) {
		this.#popoverDelayMouseenter = value;
	}

	get popoverDelayMouseleave(): string | undefined {
		return this.#popoverDelayMouseleave;
	}

	set popoverDelayMouseleave(value: string | undefined) {
		this.#popoverDelayMouseleave = value;
	}

	readonly #getFootnote = ($anchor: HTMLAnchorElement): HTMLElement => {
		if (!URL.canParse($anchor.href)) {
			throw new TypeError('The value of the `href` attribute must be a URL');
		}

		const anchorUrl = new URL($anchor.href);
		if (anchorUrl.origin !== location.origin || anchorUrl.pathname !== location.pathname) {
			throw new TypeError('The `href` attribute must be in the same content');
		}

		const id = anchorUrl.hash.slice(1);
		const $footnote = document.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
		if ($footnote === null) {
			throw new Error(`Element \`#${id}\` not found`);
		}

		const $footnoteClone = $footnote.cloneNode(true) as HTMLElement;

		/* 除外要素 */
		if (this.#ignore !== undefined) {
			$footnoteClone.querySelectorAll(this.#ignore).forEach(($ignore) => {
				$ignore.remove();
			});
		}

		return $footnoteClone;
	};

	/**
	 * ポップオーバーを表示する
	 *
	 * @param eventType - イベントの識別名
	 */
	readonly #show = (eventType: string): void => {
		const eventDetail: ToggleEventDetail = {
			newState: 'open',
			eventType: eventType,
		};
		this.#$popover?.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: eventDetail,
			}),
		);
	};

	/**
	 * ポップオーバーを非表示にする
	 *
	 * @param eventType - イベントの識別名
	 */
	readonly #hide = (eventType: string): void => {
		const eventDetail: ToggleEventDetail = {
			newState: 'closed',
			eventType: eventType,
		};
		// this.#$popover?.dispatchEvent(
		// 	new CustomEvent('my-toggle', {
		// 		detail: eventDetail,
		// 	}),
		// );
	};

	/**
	 * アンカーを click したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #anchorClickEvent = (ev: PointerEvent): void => {
		ev.preventDefault();

		clearTimeout(this.#popoverTimeoutId);

		this.#show(ev.type);
	};

	/**
	 * アンカーを pointerenter したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #anchorPointerenterEvent = (ev: PointerEvent): void => {
		if (ev.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#show(ev.type);
			},
			parseDuration(this.#popoverDelayMouseenter ?? popoverDelayMouseenterDefault),
		);
	};

	/**
	 * アンカーを pointerleave したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #anchorPointerleaveEvent = (ev: PointerEvent): void => {
		if (ev.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#hide(ev.type);
			},
			parseDuration(this.#popoverDelayMouseleave ?? popoverDelayMouseleaveDefault),
		);
	};

	/**
	 * ポップオーバーを pointerenter したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #popoverPointerenterEvent = (ev: PointerEvent): void => {
		if (ev.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#show(ev.type);
			},
			parseDuration(this.#popoverDelayMouseenter ?? popoverDelayMouseenterDefault),
		);
	};

	/**
	 * ポップオーバーを pointerleave したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #popoverPointerleaveEvent = (ev: PointerEvent): void => {
		if (ev.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#hide(ev.type);
			},
			parseDuration(this.#popoverDelayMouseleave ?? popoverDelayMouseleaveDefault),
		);
	};

	/**
	 * ポップオーバーを click したときの処理
	 *
	 * @param _ev - Event
	 */
	readonly #popoverClickEvent = (_ev: PointerEvent): void => {
		clearTimeout(this.#popoverTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `pointerenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
	};
}
