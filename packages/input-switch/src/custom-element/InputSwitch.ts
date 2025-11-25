import shadowAppendCss from '@w0s/shadow-append-css';

/**
 * Implement something like `<input type=checkbox switch>`
 */
export default class InputSwitch extends HTMLElement {
	static readonly formAssociated = true;

	static readonly observedAttributes = ['value', 'checked', 'disabled', 'storage-key'];

	readonly #internals: ElementInternals | undefined;

	readonly #myLocalStorage: Storage | undefined;

	#initilalChecked = false;

	constructor() {
		super();

		try {
			this.#internals = this.attachInternals();
		} catch {
			/* Safari 16.3- https://caniuse.com/mdn-api_htmlelement_attachinternals */
		}

		try {
			this.#myLocalStorage = localStorage;
		} catch {
			console.info('Storage access blocked.');
		}

		const htmlString = `
			<div part="track"></div>
			<div part="thumb"></div>
		`;

		const cssString = `
			:host {
				--outline-offset: 1px;
				--block-size: 1em;
				--inline-size: 2em;
				--animation-duration: 0.5s;

				--track-color-on: #29f;
				--track-color-off: #ccc;
				--track-color-disabled-on: #666;
				--track-color-disabled-off: #666;

				--thumb-radius: calc(0.5em - 1px);
				--thumb-color: #fff;

				--_padding: max(var(--thumb-radius) - var(--block-size) / 2, 0px);

				display: inline flow-root;
				outline-offset: var(--outline-offset);
				padding: var(--_padding);
				block-size: var(--block-size);
				inline-size: var(--inline-size);
				vertical-align: middle;
				contain: layout;
			}

			:host::part(track) {
				--_color: var(--track-color-off);

				transition: background-color var(--animation-duration);
				border-radius: var(--block-size);
				background-color: var(--_color);
				block-size: 100%;
				inline-size: 100%;
			}

			:host(:state(checked))::part(track) {
				--_color: var(--track-color-on);
			}

			:host(:state(disabled))::part(track) {
				--_color: var(--track-color-disabled-off);
			}

			:host(:state(disabled):state(checked))::part(track) {
				--_color: var(--track-color-disabled-on);
			}

			:host::part(thumb) {
				--_translate-x: 0px;

				position: absolute;
				inset: calc(var(--block-size) / 2 - var(--thumb-radius) + var(--_padding));
				translate: var(--_translate-x);
				transition: translate var(--animation-duration);
				border-radius: 50%;
				background-color: var(--thumb-color);
				block-size: calc(var(--thumb-radius) * 2);
				inline-size: calc(var(--thumb-radius) * 2);
			}

			:host(:state(checked))::part(thumb) {
				--_translate-x: calc(var(--inline-size) - var(--block-size));
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		'setHTMLUnsafe' in shadow ? shadow.setHTMLUnsafe(htmlString) : ((shadow as ShadowRoot).innerHTML = htmlString);
		shadowAppendCss(shadow, cssString);
	}

	connectedCallback(): void {
		const { checked, disabled, storageKey } = this;

		if (storageKey !== null && storageKey !== '') {
			/* ストレージから前回アクセス時のチェック情報を取得する */
			const storageValue = this.#myLocalStorage?.getItem(storageKey);
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

		this.#internals?.setFormValue(this.checked ? this.value : null);
		this.#initilalChecked = checked;
		this.tabIndex = disabled ? -1 : 0;
		this.setAttribute('role', 'switch');
		this.setAttribute('aria-checked', String(checked));
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
					this.#internals?.states.add('checked');
				} else {
					this.#internals?.states.delete('checked');
				}

				break;
			}
			case 'disabled': {
				const disabled = newValue !== null;

				this.setAttribute('aria-disabled', String(disabled));

				if (disabled) {
					this.tabIndex = -1;

					this.#internals?.states.add('disabled');

					this.removeEventListener('change', this.#changeEvent);
					this.removeEventListener('click', this.#clickEvent);
					this.removeEventListener('keydown', this.#keydownEvent);

					this.blur();
				} else {
					this.tabIndex = 0;

					this.#internals?.states.delete('disabled');

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

		this.#internals?.setFormValue(this.checked ? this.value : null);

		if (storageKey !== null && storageKey !== '') {
			/* スイッチのチェック情報をストレージに保管する */
			this.#myLocalStorage?.setItem(storageKey, String(this.checked));
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
