import { parseDuration } from '../util/cssUnits.ts';
import { getFootnote } from '../util/utility.ts';

const popoverDelayMouseenterDefault = '100ms';
const popoverDelayMouseleaveDefault = '500ms';

export default class extends HTMLElement {
	/* Elements */
	readonly #$anchorSlot: HTMLSlotElement;
	readonly #$popover: HTMLElement;
	readonly #$popoverContent: HTMLElement;
	readonly #$popoverHideButton: HTMLButtonElement;
	#$anchor: HTMLAnchorElement | undefined;

	/* Attributes */
	#ignoreSelectors: string | undefined;
	#popoverLabel: string | undefined;
	#popoverDelayMouseenter: string | undefined;
	#popoverDelayMouseleave: string | undefined;

	/* etc */
	#popoverTimeoutId?: NodeJS.Timeout; // ポップオーバーを表示する際のタイマーの識別 ID（`clearTimeout()` で使用）

	static get observedAttributes(): string[] {
		return ['ignore', 'popover-label', 'popover-delay-mouseenter', 'popover-delay-mouseleave'];
	}

	constructor() {
		super();

		const htmlString = `
			<slot name="anchor" part="anchor"></slot>
			<div popover="" id="popover" part="popover">
				<div part="popover__content"></div>
				<button type="button" popovertarget="popover" popovertargetaction="hide" part="popover__hide"></button>
			</div>
		`;

		const cssString = `
			[part~="anchor"] {
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
		shadow.setHTMLUnsafe(htmlString);

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);

		this.#$anchorSlot = shadow.querySelector<HTMLSlotElement>('slot[name="anchor"]')!;
		this.#$popover = shadow.querySelector<HTMLElement>('#popover')!;
		this.#$popoverContent = shadow.querySelector<HTMLElement>('[part~=popover__content]')!;
		this.#$popoverHideButton = shadow.querySelector<HTMLButtonElement>('[part~=popover__hide]')!;
	}

	connectedCallback(): void {
		{
			const $anchor = this.#$anchorSlot.assignedNodes().at(0);
			if ($anchor === undefined) {
				throw new Error('Element `[slot=anchor]` not found');
			}
			if (!($anchor instanceof HTMLAnchorElement)) {
				throw new TypeError('Element `[slot=anchor]` must be a `<a>` element');
			}
			$anchor.role = 'button';
			$anchor.ariaExpanded = 'false'; // popovertarget's mapping <https://www.w3.org/TR/html-aam-1.0/#att-popovertarget>
			this.#$anchor = $anchor;

			this.#$anchor.addEventListener('click', this.#anchorClickEvent);
			this.#$anchor.addEventListener('pointerenter', this.#anchorPointerenterEvent, { passive: true });
			this.#$anchor.addEventListener('pointerleave', this.#anchorPointerleaveEvent, { passive: true });
		}

		{
			if (this.#popoverLabel !== undefined) {
				this.#$popover.ariaLabel = this.#popoverLabel;
			}

			const { width, height } = this.#$anchor.getBoundingClientRect();
			this.#$popover.dataset['anchorWidth'] = String(Number(width.toFixed(3)));
			this.#$popover.dataset['anchorHeight'] = String(Number(height.toFixed(3)));

			this.#$popover.addEventListener('toggle', this.#popoverToggleEvent, { passive: true });
			this.#$popover.addEventListener('click', this.#popoverClickEvent, { passive: true });
			this.#$popover.addEventListener('pointerenter', this.#popoverPointerenterEvent, { passive: true });
			this.#$popover.addEventListener('pointerleave', this.#popoverPointerleaveEvent, { passive: true });
		}

		{
			this.#$popoverContent.setHTMLUnsafe(getFootnote(this.querySelector('[slot="anchor"]'), { ignoreSelectors: this.#ignoreSelectors }).innerHTML);
		}

		{
			const $popoverHideButton = this.querySelector('[slot="popover__hide"]');
			if ($popoverHideButton !== null && !($popoverHideButton instanceof HTMLTemplateElement)) {
				throw new TypeError('Element `[slot=popover__hide]` must be a `<template>` element');
			}

			this.#$popoverHideButton.append($popoverHideButton?.content ?? 'Close');
		}
	}

	disconnectedCallback(): void {
		this.#$anchor?.removeEventListener('click', this.#anchorClickEvent);
		this.#$anchor?.removeEventListener('pointerenter', this.#anchorPointerenterEvent);
		this.#$anchor?.removeEventListener('pointerleave', this.#anchorPointerleaveEvent);

		this.#$popover.removeEventListener('toggle', this.#popoverToggleEvent);
		this.#$popover.removeEventListener('click', this.#popoverClickEvent);
		this.#$popover.removeEventListener('pointerenter', this.#popoverPointerenterEvent);
		this.#$popover.removeEventListener('pointerleave', this.#popoverPointerleaveEvent);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'ignore': {
				this.#ignoreSelectors = newValue ?? undefined;
				break;
			}
			case 'popover-label': {
				this.#popoverLabel = newValue ?? undefined;
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
		return this.#ignoreSelectors;
	}

	set ignore(value: string | undefined) {
		this.#ignoreSelectors = value;
	}

	get popoverLabel(): string | undefined {
		return this.#popoverLabel;
	}

	set popoverLabel(value: string | undefined) {
		this.#popoverLabel = value;
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

	/**
	 * ポップオーバーを表示する
	 *
	 * @param _eventType - イベントの識別名
	 */
	readonly #showPopover = (_eventType: string): void => {
		this.#$popover.showPopover();
	};

	/**
	 * ポップオーバーを非表示にする
	 *
	 * @param _eventType - イベントの識別名
	 */
	readonly #hidePopover = (_eventType: string): void => {
		this.#$popover.hidePopover();
	};

	/**
	 * Anchor: `click` event
	 *
	 * @param event - Event
	 */
	readonly #anchorClickEvent = (event: PointerEvent): void => {
		event.preventDefault();

		clearTimeout(this.#popoverTimeoutId);

		this.#showPopover(event.type);
	};

	/**
	 * Anchor: `pointerenter` event
	 *
	 * @param event - Event
	 */
	readonly #anchorPointerenterEvent = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#showPopover(event.type);
			},
			parseDuration(this.#popoverDelayMouseenter ?? popoverDelayMouseenterDefault),
		);
	};

	/**
	 * Anchor: `pointerleave` event
	 *
	 * @param event - Event
	 */
	readonly #anchorPointerleaveEvent = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#hidePopover(event.type);
			},
			parseDuration(this.#popoverDelayMouseleave ?? popoverDelayMouseleaveDefault),
		);
	};

	/**
	 * Popover: `toggle` event
	 *
	 * @param event - Event
	 */
	readonly #popoverToggleEvent = (event: ToggleEvent): void => {
		if (this.#$anchor !== undefined) {
			this.#$anchor.ariaExpanded = event.newState === 'open' ? 'true' : 'false';
		}
	};

	/**
	 * Popover: `click` event
	 *
	 * @param _event - Event
	 */
	readonly #popoverClickEvent = (_event: PointerEvent): void => {
		clearTimeout(this.#popoverTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `pointerenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
	};

	/**
	 * Popover: `pointerenter` event
	 *
	 * @param event - Event
	 */
	readonly #popoverPointerenterEvent = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#showPopover(event.type);
			},
			parseDuration(this.#popoverDelayMouseenter ?? popoverDelayMouseenterDefault),
		);
	};

	/**
	 * Popover: `pointerleave` event
	 *
	 * @param event - Event
	 */
	readonly #popoverPointerleaveEvent = (event: PointerEvent): void => {
		if (event.pointerType !== 'mouse') {
			return;
		}

		clearTimeout(this.#popoverTimeoutId);

		this.#popoverTimeoutId = setTimeout(
			(): void => {
				this.#hidePopover(event.type);
			},
			parseDuration(this.#popoverDelayMouseleave ?? popoverDelayMouseleaveDefault),
		);
	};
}
