/**
 * Tabs UI component
 */
export default class Tab extends HTMLElement {
	/* Light DOM elements */
	readonly #$$tab: readonly HTMLAnchorElement[];
	readonly #$$tabpanel: readonly HTMLElement[];

	/* Shadow DOM elements */
	readonly #$tablist: HTMLElement;

	/* Attributes */
	#tablistLabel: string | undefined;
	#storageKey: string | undefined;

	/* etc */
	readonly #storage: Storage | undefined;
	#selectedTabNo = 0; // 何番目のタブが選択されているか

	static get observedAttributes(): string[] {
		return ['tablist-label', 'storage-key'];
	}

	constructor() {
		super();

		try {
			this.#storage = sessionStorage;
		} catch {
			console.info('Storage access blocked.');
		}

		const htmlString = `
			<div part="tablist" role="tablist">
				<slot name="tab"></slot>
			</div>
			<div part="tabpanels">
				<slot name="tabpanel"></slot>
			</div>
		`;

		const cssString = `
			:host {
				display: block flow;
			}

			[part~="tablist"] {
				display: block flex;
				flex-wrap: nowrap;
				align-items: flex-end;
			}

			::slotted([role="tab" i]) {
				cursor: default;
			}

			::slotted([role="tabpanel" i].is-hidden) {
				display: none;
			}
		`;

		const shadow = this.attachShadow({ mode: 'open' });
		// oxlint-disable-next-line no-unused-expressions
		'setHTMLUnsafe' in shadow ? shadow.setHTMLUnsafe(htmlString) : ((shadow as ShadowRoot).innerHTML = htmlString);

		const css = new CSSStyleSheet();
		css.replaceSync(cssString);
		shadow.adoptedStyleSheets.push(css);

		this.#$tablist = shadow.querySelector<HTMLElement>('[part~="tablist"]')!;

		this.#$$tab = shadow
			.querySelector<HTMLSlotElement>('slot[name="tab"]')!
			.assignedNodes()
			.map(($tab) => {
				if (!($tab instanceof HTMLAnchorElement)) {
					throw new TypeError('Element `[slot=tab]` must be a `<a>` element');
				}
				return $tab;
			});

		this.#$$tabpanel = shadow
			.querySelector<HTMLSlotElement>('slot[name="tabpanel"]')!
			.assignedNodes()
			.filter(($tabpanel) => $tabpanel instanceof HTMLElement);
	}

	connectedCallback(): void {
		this.#$$tab.forEach(($tab): void => {
			const tabpanelId = decodeURIComponent($tab.hash.slice(1));
			if (tabpanelId === '') {
				throw new Error(`The \`href\` attribute of element \`a[slot=tab]\` does not contain a hash`);
			}
			const $tabpanel = this.querySelector<HTMLElement>(`#${CSS.escape(tabpanelId)}`);
			if ($tabpanel === null) {
				throw new Error(`Element \`#${tabpanelId}\` not found`);
			}
			if (!this.#$$tabpanel.includes($tabpanel)) {
				throw new Error(`Element \`#${tabpanelId}\` does not have the appropriate \`slot\` attribute set`);
			}

			$tab.removeAttribute('href');
			$tab.role = 'tab';
			$tab.ariaControlsElements = [$tabpanel];

			$tabpanel.role = 'tabpanel';
			$tabpanel.ariaLabelledByElements = [$tab];

			$tab.addEventListener('click', this.#tabClickEvent, { passive: true });
			$tab.addEventListener('keydown', this.#tabKeydownEvent);
		});

		this.#$$tabpanel.forEach(($tabpanel) => {
			$tabpanel.addEventListener('keydown', this.#tabpanelKeydownEvent);
		});

		if (this.#storageKey === undefined) /* 属性設定時は先に attributeChangedCallback() で処理されている */ {
			this.#selectTab(0);
		}
	}

	disconnectedCallback(): void {
		this.#$$tab.forEach(($tab) => {
			$tab.removeEventListener('click', this.#tabClickEvent);
			$tab.removeEventListener('keydown', this.#tabKeydownEvent);
		});

		this.#$$tabpanel.forEach(($tabpanel) => {
			$tabpanel.removeEventListener('keydown', this.#tabpanelKeydownEvent);
		});
	}

	attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
		switch (name) {
			case 'tablist-label': {
				this.tablistLabel = newValue ?? undefined;
				break;
			}
			case 'storage-key': {
				this.storageKey = newValue ?? undefined;
				break;
			}
			default:
		}
	}

	get tablistLabel(): string | undefined {
		return this.#tablistLabel;
	}

	set tablistLabel(value: string | undefined) {
		this.#tablistLabel = value;

		this.#$tablist.ariaLabel = value ?? null;
	}

	get storageKey(): string | undefined {
		return this.#storageKey;
	}

	set storageKey(value: string | undefined) {
		this.#storageKey = value;

		const getSelectedTabNo = (storageKey: string | undefined): number | undefined => {
			if (storageKey === undefined) {
				return undefined;
			}

			const tabpanelId = this.#storage?.getItem(storageKey); // 前回選択したタブパネル ID
			if (tabpanelId === null || tabpanelId === undefined) {
				return undefined;
			}

			const $rabpanel = this.querySelector<HTMLElement>(`#${CSS.escape(tabpanelId)}`);
			if ($rabpanel === null) {
				console.info(`[tab] Element \`#${tabpanelId}\` not found.`);
				return undefined;
			}

			return this.#$$tabpanel.indexOf($rabpanel);
		};

		this.#selectedTabNo = getSelectedTabNo(value) ?? 0;

		this.#selectTab(this.#selectedTabNo);
	}

	/**
	 * Tab: `click` event
	 *
	 * @param event - Event
	 */
	readonly #tabClickEvent = (event: PointerEvent): void => {
		this.#changeTab(this.#$$tab.indexOf(event.currentTarget as HTMLAnchorElement));
	};

	/**
	 * Tab: `keydown` event
	 *
	 * @param event - Event
	 */
	readonly #tabKeydownEvent = (event: KeyboardEvent): void => {
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				event.preventDefault();

				this.#changeTab(this.#selectedTabNo < 1 ? this.#$$tab.length - 1 : this.#selectedTabNo - 1);

				break;
			}
			case 'ArrowRight':
			case 'ArrowDown': {
				event.preventDefault();

				this.#changeTab(this.#selectedTabNo >= this.#$$tab.length - 1 ? 0 : this.#selectedTabNo + 1);

				break;
			}
			case 'End': {
				event.preventDefault();

				this.#changeTab(this.#$$tab.length - 1);

				break;
			}
			case 'Home': {
				event.preventDefault();

				this.#changeTab(0);

				break;
			}
			default:
		}
	};

	/**
	 * Tabpanel: `keydown` event
	 *
	 * @param event - Event
	 */
	readonly #tabpanelKeydownEvent = (event: KeyboardEvent): void => {
		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				if (event.ctrlKey) {
					/* Ctrl キーが同時に押下された場合は、選択中の [role="tab"] な要素にフォーカスを移動する */
					event.preventDefault();

					this.#$$tab.at(this.#selectedTabNo)?.focus();
				}

				break;
			}
			default:
		}
	};

	/**
	 * タブを選択する
	 *
	 * @param tabNo - 選択するタブ番号
	 */
	#selectTab(tabNo: number): void {
		this.#$$tab.forEach(($tab, index) => {
			const select = index === tabNo; // 選択されたタブかどうか

			$tab.tabIndex = select ? 0 : -1;
			$tab.ariaSelected = String(select);

			const tabpanelClasslist = this.#$$tabpanel.at(index)?.classList;
			if (select) {
				tabpanelClasslist?.remove('is-hidden');
			} else {
				tabpanelClasslist?.add('is-hidden');
			}
		});

		this.#selectedTabNo = tabNo;
	}

	/**
	 * ユーザー操作によりタブを切り替える
	 *
	 * @param tabNo - 切り替えるタブ番号
	 */
	#changeTab(tabNo: number): void {
		this.#selectTab(tabNo);

		this.#$$tab.at(tabNo)?.focus();

		/* 現在選択中のタブ情報をストレージに保管する */
		if (this.#storageKey !== undefined) {
			const $tabpanel = this.#$$tabpanel.at(tabNo);
			if ($tabpanel !== undefined) {
				this.#storage?.setItem(this.#storageKey, $tabpanel.id);
			}
		}
	}
}
