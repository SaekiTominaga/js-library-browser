/**
 * Tabs UI component
 */
export default class Tab extends HTMLElement {
	/* Light DOM elements */
	readonly #$$tab: readonly HTMLAnchorElement[] = [];
	readonly #$$tabpanel: readonly HTMLElement[] = [];

	/* Shadow DOM elements */
	readonly #$tablist: HTMLElement;

	/* Attributes */
	#tablistLabel: string | undefined;
	#storageKey: string | undefined;

	/* etc */
	readonly #TABPANEL_HIDDEN_CLASS_NAME = 'is-hidden'; // タブパネルを非表示にするクラス名
	readonly #mySessionStorage: Storage | undefined;
	#selectedTabNo = 0; // 何番目のタブが選択されているか

	static get observedAttributes(): string[] {
		return ['tablist-label', 'storage-key'];
	}

	constructor() {
		super();

		try {
			this.#mySessionStorage = sessionStorage;
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
		this.#$$tab = shadow.querySelector<HTMLSlotElement>('slot[name="tab"]')!.assignedNodes({ flatten: true }) as HTMLAnchorElement[];
		this.#$$tabpanel = shadow.querySelector<HTMLSlotElement>('slot[name="tabpanel"]')!.assignedNodes({ flatten: true }) as HTMLElement[];
	}

	connectedCallback(): void {
		this.#$$tab.forEach((tabElement): void => {
			const { href } = tabElement;
			if (href === '') {
				throw new Error('The `href` attribute is not set');
			}

			const { hash } = new URL(href);
			if (hash === '') {
				throw new Error('The `href` attribute does not contain hash');
			}

			const tabpanelElementId = decodeURIComponent(hash.slice(1));
			const tabpanelElement = document.querySelector<HTMLElement>(`#${tabpanelElementId}`);
			if (tabpanelElement === null) {
				throw new Error(`Element \`#${tabpanelElementId}\` not found`);
			}

			tabElement.removeAttribute('href');
			tabElement.role = 'tab';
			tabElement.ariaControlsElements = [tabpanelElement];

			tabpanelElement.role = 'tabpanel';
			tabpanelElement.ariaLabelledByElements = [tabElement];

			tabElement.addEventListener('click', this.#tabClickEvent, { passive: true });
			tabElement.addEventListener('keydown', this.#tabKeydownEvent);
			tabpanelElement.addEventListener('keydown', this.#tabpanelKeydownEvent);
		});

		if (this.#storageKey === undefined) /* 属性設定時は先に attributeChangedCallback() で処理されている */ {
			this.#selectTab(0);
		}
	}

	disconnectedCallback(): void {
		this.#$$tab.forEach((tabElement) => {
			tabElement.removeEventListener('click', this.#tabClickEvent);
			tabElement.removeEventListener('keydown', this.#tabKeydownEvent);
		});

		this.#$$tabpanel.forEach((tabpanelElement) => {
			tabpanelElement.removeEventListener('keydown', this.#tabpanelKeydownEvent);
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

			const tabpanelId = this.#mySessionStorage?.getItem(storageKey); // 前回選択したタブパネル ID
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
	 * タブをクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	readonly #tabClickEvent = (ev: MouseEvent): void => {
		this.#changeTab(this.#$$tab.indexOf(ev.currentTarget as HTMLAnchorElement));
	};

	/**
	 * タブをキーボード操作したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #tabKeydownEvent = (ev: KeyboardEvent): void => {
		switch (ev.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				ev.preventDefault();

				this.#changeTab(this.#selectedTabNo < 1 ? this.#$$tab.length - 1 : this.#selectedTabNo - 1);

				break;
			}
			case 'ArrowRight':
			case 'ArrowDown': {
				ev.preventDefault();

				this.#changeTab(this.#selectedTabNo >= this.#$$tab.length - 1 ? 0 : this.#selectedTabNo + 1);

				break;
			}
			case 'End': {
				ev.preventDefault();

				this.#changeTab(this.#$$tab.length - 1);

				break;
			}
			case 'Home': {
				ev.preventDefault();

				this.#changeTab(0);

				break;
			}
			default:
		}
	};

	/**
	 * タブパネルをキーボード操作したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #tabpanelKeydownEvent = (ev: KeyboardEvent): void => {
		switch (ev.key) {
			case 'ArrowLeft':
			case 'ArrowUp': {
				if (ev.ctrlKey) {
					/* Ctrl キーが同時に押下された場合は、選択中の [role="tab"] な要素にフォーカスを移動する */
					ev.preventDefault();

					this.#$$tab[this.#selectedTabNo]?.focus();
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
		this.#$$tab.forEach((tabElement, index) => {
			const select = index === tabNo; // 選択されたタブかどうか

			tabElement.tabIndex = select ? 0 : -1;
			tabElement.ariaSelected = String(select);

			const tabpanelClasslist = this.#$$tabpanel[index]?.classList;
			if (select) {
				tabpanelClasslist?.remove(this.#TABPANEL_HIDDEN_CLASS_NAME);
			} else {
				tabpanelClasslist?.add(this.#TABPANEL_HIDDEN_CLASS_NAME);
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
			const tabpanelElement = this.#$$tabpanel.at(tabNo);
			if (tabpanelElement !== undefined) {
				this.#mySessionStorage?.setItem(this.#storageKey, tabpanelElement.id);
			}
		}
	}
}
