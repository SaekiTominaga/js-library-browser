/**
 * Implement something like `<input type=checkbox switch>`
 */
export default class InputSwitch extends HTMLElement {
	static readonly formAssociated = true;

	static readonly observedAttributes = ['value', 'checked', 'disabled', 'storage-key'];

	readonly #internals: ElementInternals;

	readonly #storage: Storage | undefined;

	#initilalChecked = false;

	constructor() {
		super();

		this.#internals = this.attachInternals();

		try {
			this.#storage = localStorage;
		} catch {
			console.info('[@w0s/input-switch] Storage access blocked.');
		}

		const htmlString = `
			<div part="track"><span part="thumb"></span></div>
		`;

		const cssString = `
			:host {
				--block-size: 1.9em;
				--inline-size: calc(var(--block-size) * 2.3);
				--animation-duration: 0.25s;
				--disabled-opacity: 0.5;
				--track-color-on: oklch(73.03% 0.1944 147.44deg);
				--track-color-off: oklch(82.09% 0.0028 286.34deg);
				--thumb-block-size: calc(var(--block-size) - 4px);
				--thumb-inline-size: calc(var(--thumb-block-size) * 1.5);
				--thumb-color: oklch(100% 0 0deg);

				--_track-color: var(--track-color-off);
				--_thumb-border-width: max((var(--block-size) - var(--thumb-block-size)) / 2, 0px);
				--_thumb-translate-x: 0px;

				display: inline flow-root;
				block-size: var(--block-size);
				inline-size: var(--inline-size);
			}

			:host(:state(checked)) {
				--_track-color: var(--track-color-on);
				--_thumb-translate-x: calc(var(--inline-size) - var(--thumb-inline-size) - var(--_thumb-border-width) * 2);
			}

			:host(:state(disabled)) {
				opacity: var(--disabled-opacity);
			}

			[part~="track"] {
				display: inline flex;
				flex-wrap: nowrap;
				align-items: center;
				transition-duration: var(--animation-duration);
				transition-property: background-color;
				border-radius: var(--block-size);
				background-color: var(--_track-color);
				block-size: 100%;
				inline-size: 100%;
				contain: layout;
			}

			[part~="thumb"] {
				translate: var(--_thumb-translate-x);
				transition-duration: var(--animation-duration);
				transition-property: translate, border-color;
				border: var(--_thumb-border-width) solid var(--_track-color);
				border-radius: var(--thumb-block-size);
				background-color: var(--thumb-color);
				block-size: calc(var(--thumb-block-size));
				inline-size: calc(var(--thumb-inline-size));
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		// oxlint-disable-next-line no-unused-expressions
		'setHTMLUnsafe' in shadow ? shadow.setHTMLUnsafe(htmlString) : ((shadow as ShadowRoot).innerHTML = htmlString);

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);
	}

	connectedCallback(): void {
		const { checked, disabled, storageKey } = this;

		if (storageKey !== null && storageKey !== '') {
			/* ストレージから前回アクセス時のチェック情報を取得する */
			const storageValue = this.#storage?.getItem(storageKey);
			switch (storageValue) {
				case 'true': {
					if (!checked) {
						this.checked = true;
					}
					break;
				}
				case 'false': {
					if (checked) {
						this.checked = false;
					}
					break;
				}
				default:
			}
		}

		// oxlint-disable-next-line unicorn/no-null
		this.#internals.setFormValue(this.checked ? this.value : null);
		this.#initilalChecked = checked;
		this.tabIndex = disabled ? -1 : 0;
		this.setAttribute('role', 'switch');
		this.setAttribute('aria-checked', String(this.checked));
		this.setAttribute('aria-disabled', String(disabled));

		if (!disabled) {
			this.addEventListener('change', this.#changeEvent, { passive: true });
			this.addEventListener('click', this.#clickEvent);
			this.addEventListener('keydown', this.#keydownEvent);
		}
	}

	disconnectedCallback(): void {
		this.removeEventListener('change', this.#changeEvent);
		this.removeEventListener('click', this.#clickEvent);
		this.removeEventListener('keydown', this.#keydownEvent);
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'value': {
				break;
			}
			case 'checked': {
				const checked = newValue !== null;

				this.setAttribute('aria-checked', String(checked));

				if (checked) {
					this.#internals.states.add('checked');
				} else {
					this.#internals.states.delete('checked');
				}

				break;
			}
			case 'disabled': {
				const disabled = newValue !== null;

				this.setAttribute('aria-disabled', String(disabled));

				if (disabled) {
					this.tabIndex = -1;

					this.#internals.states.add('disabled');

					this.removeEventListener('change', this.#changeEvent);
					this.removeEventListener('click', this.#clickEvent);
					this.removeEventListener('keydown', this.#keydownEvent);

					this.blur();
				} else {
					this.tabIndex = 0;

					this.#internals.states.delete('disabled');

					this.addEventListener('change', this.#changeEvent, { passive: true });
					this.addEventListener('click', this.#clickEvent);
					this.addEventListener('keydown', this.#keydownEvent);
				}

				break;
			}
			case 'storage-key': {
				break;
			}
			default:
		}
	}

	formResetCallback(): void {
		if (this.checked !== this.#initilalChecked) {
			this.dispatchEvent(new Event('change'));
		}
	}

	get value(): string {
		return this.getAttribute('value') ?? 'on'; // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
	}

	set value(value: string | null) {
		if (value === null) {
			this.removeAttribute('value');
			return;
		}

		this.setAttribute('value', value);
	}

	get checked(): boolean {
		return this.getAttribute('checked') !== null;
	}

	set checked(value: boolean) {
		if (value) {
			this.setAttribute('checked', '');
		} else {
			this.removeAttribute('checked');
		}
	}

	get disabled(): boolean {
		return this.getAttribute('disabled') !== null;
	}

	set disabled(value: boolean) {
		if (value) {
			this.setAttribute('disabled', '');
		} else {
			this.removeAttribute('disabled');
		}
	}

	get storageKey(): string | null {
		return this.getAttribute('storage-key');
	}

	set storageKey(value: string | null) {
		if (value === null) {
			this.removeAttribute('storage-key');
			return;
		}

		this.setAttribute('storage-key', value);
	}

	/**
	 * スイッチの状態を変更する
	 */
	readonly #changeEvent = (): void => {
		const { checked, storageKey } = this;

		this.checked = !checked;

		// oxlint-disable-next-line unicorn/no-null
		this.#internals.setFormValue(this.checked ? this.value : null);

		if (storageKey !== null && storageKey !== '') {
			/* スイッチのチェック情報をストレージに保管する */
			this.#storage?.setItem(storageKey, String(this.checked));
		}
	};

	/**
	 * スイッチをクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	readonly #clickEvent = (ev: MouseEvent): void => {
		this.dispatchEvent(new Event('change'));
		ev.preventDefault();
	};

	/**
	 * スイッチにフォーカスした状態でキーボードが押された時の処理
	 *
	 * @param ev - Event
	 */
	readonly #keydownEvent = (ev: KeyboardEvent): void => {
		switch (ev.key) {
			case ' ': {
				this.dispatchEvent(new Event('change'));
				ev.preventDefault();
				break;
			}
			default:
		}
	};
}
