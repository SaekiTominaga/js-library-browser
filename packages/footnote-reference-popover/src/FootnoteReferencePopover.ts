import FootnoteElement from './attribute/FootnoteElement.js';
import Mouseenter from './attribute/Mouseenter.js';
import Mouseleave from './attribute/Mouseleave.js';
import PopoverClass from './attribute/PopoverClass.js';
import PopoverHide from './attribute/PopoverHide.js';
import PopoverLabel from './attribute/PopoverLabel.js';
import CustomElementPopover, { type ToggleEventDetail } from './custom-element/Popover.js';

customElements.define('x-popover', CustomElementPopover);

/**
 * Footnote reference popover
 */
export default class {
	readonly #popoverTriggerElement: HTMLAnchorElement;

	readonly #popoverElement: CustomElementPopover;

	readonly #footnoteElement: FootnoteElement; // 脚注要素（ポップオーバーの内容をここからコピーする）

	readonly #popoverLabel: PopoverLabel; // ポップオーバーに設定するラベル

	readonly #popoverClass: PopoverClass; // ポップオーバーに設定するクラス名

	readonly #popoverHide: PopoverHide; // ポップオーバーの閉じるボタン

	readonly #mouseenter: Mouseenter; // mouseenter 時のデータ

	readonly #mouseleave: Mouseleave; // mouseleave 時のデータ

	#mouseenterTimeoutId?: NodeJS.Timeout; // ポップオーバーを表示する際のタイマーの識別 ID（`clearTimeout()` で使用）

	#mouseleaveTimeoutId?: NodeJS.Timeout; // ポップオーバーを非表示にする際のタイマーの識別 ID（`clearTimeout()` で使用）

	#preloadProcessed = false; // `<link rel="preload" as="image" />` の生成処理を実行したかどうか

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLAnchorElement) {
		this.#popoverTriggerElement = thisElement;

		const { href: hrefAttribute } = thisElement;
		const {
			popoverLabel: popoverLabelAttribute,
			popoverClass: popoverClassAttribute,
			popoverHideText: popoverHideTextAttribute,
			popoverHideImageSrc: popoverHideImageSrcAttribute,
			popoverHideImageWidth: popoverHideImageWidthAttribute,
			popoverHideImageHeight: popoverHideImageHeightAttribute,
			mouseenterDelay: mouseenterDelayAttribute,
			mouseleaveDelay: mouseleaveDelayAttribute,
		} = thisElement.dataset;

		this.#footnoteElement = new FootnoteElement(hrefAttribute);
		this.#popoverLabel = new PopoverLabel(popoverLabelAttribute);
		this.#popoverClass = new PopoverClass(popoverClassAttribute);
		this.#popoverHide = new PopoverHide({
			text: popoverHideTextAttribute,
			imageSrc: popoverHideImageSrcAttribute,
			imageWidth: popoverHideImageWidthAttribute,
			imageHeight: popoverHideImageHeightAttribute,
		});
		this.#mouseenter = new Mouseenter({ delay: mouseenterDelayAttribute ?? '250' });
		this.#mouseleave = new Mouseleave({ delay: mouseleaveDelayAttribute ?? '250' });

		this.#popoverElement = document.createElement('x-popover') as CustomElementPopover;

		if (!('showPopover' in this.#popoverElement)) {
			console.info('This browser does not support popover');
			return;
		}

		thisElement.setAttribute('role', 'button');

		thisElement.addEventListener('click', this.#clickEvent);
		thisElement.addEventListener('mouseenter', this.#mouseEnterEvent, { passive: true });
		thisElement.addEventListener('mouseleave', this.#mouseLeaveEvent, { passive: true });
	}

	/**
	 * `click` event
	 *
	 * @param ev - MouseEvent
	 */
	#clickEvent = (ev: MouseEvent): void => {
		ev.preventDefault();

		clearTimeout(this.#mouseleaveTimeoutId);

		this.#show(ev.type);
	};

	/**
	 * `mouseenter` event
	 *
	 * @param ev - MouseEvent
	 */
	#mouseEnterEvent = (ev: MouseEvent): void => {
		clearTimeout(this.#mouseleaveTimeoutId);

		this.#imagePreloadElementCreate();

		this.#mouseenterTimeoutId = setTimeout((): void => {
			this.#show(ev.type);
		}, this.#mouseenter.delay);
	};

	/**
	 * `mouseleave` event
	 *
	 * @param ev - MouseEvent
	 */
	#mouseLeaveEvent = (ev: MouseEvent): void => {
		clearTimeout(this.#mouseenterTimeoutId);

		this.#mouseleaveTimeoutId = setTimeout((): void => {
			this.#hide(ev.type);
		}, this.#mouseleave.delay);
	};

	/**
	 * ポップオーバーを生成する
	 */
	#create(): void {
		const footnoteElement = this.#footnoteElement.element;

		const popoverElement = this.#popoverElement;
		if (this.#popoverClass.name !== undefined) {
			popoverElement.className = this.#popoverClass.name;
		}
		popoverElement.label = this.#popoverLabel.text ?? null;
		popoverElement.hideText = this.#popoverHide.text ?? null;
		popoverElement.hideImageSrc = this.#popoverHide.imageSrc ?? null;
		popoverElement.hideImageWidth = this.#popoverHide.imageWidth ?? null;
		popoverElement.hideImageHeight = this.#popoverHide.imageHeight ?? null;
		popoverElement.insertAdjacentHTML('afterbegin', 'getHTML' in footnoteElement ? footnoteElement.getHTML() : (footnoteElement as HTMLElement).innerHTML);
		document.body.appendChild(popoverElement);

		popoverElement.addEventListener(
			'mouseenter',
			(ev: MouseEvent) => {
				clearTimeout(this.#mouseleaveTimeoutId);

				this.#mouseenterTimeoutId = setTimeout((): void => {
					this.#show(ev.type);
				}, this.#mouseenter.delay);
			},
			{ passive: true },
		);
		popoverElement.addEventListener(
			'mouseleave',
			(ev: MouseEvent) => {
				clearTimeout(this.#mouseenterTimeoutId);

				this.#mouseleaveTimeoutId = setTimeout((): void => {
					this.#hide(ev.type);
				}, this.#mouseleave.delay);
			},
			{ passive: true },
		);

		popoverElement.hideButtonElement.addEventListener(
			'click',
			() => {
				clearTimeout(this.#mouseenterTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `mouseenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
			},
			{ passive: true },
		);
	}

	/**
	 * ポップオーバーを表示する
	 *
	 * @param eventType - イベントの識別名
	 */
	#show(eventType: string): void {
		const popoverElement = this.#popoverElement;

		if (!popoverElement.isConnected) {
			/* 初回表示時はポップオーバーの生成を行う */
			this.#create();
		}

		const triggerRect = this.#popoverTriggerElement.getBoundingClientRect();

		/* ポップオーバーの上位置を設定（トリガー要素の下端を基準にする） */
		popoverElement.style.width = 'auto';
		popoverElement.style.top = `${String(Math.round(triggerRect.bottom) + window.scrollY)}px`;
		popoverElement.style.right = 'auto';
		popoverElement.style.left = 'auto';

		/* ポップオーバーを表示 */
		const eventDetail: ToggleEventDetail = {
			newState: 'open',
			eventType: eventType,
		};
		popoverElement.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: eventDetail,
			}),
		);

		/* ポップオーバーの左右位置を設定（トリガー要素の左端を基準にする） */
		const documentWidth = document.documentElement.offsetWidth;
		const popoverWidth = popoverElement.width;
		const triggerRectLeft = triggerRect.left;

		popoverElement.style.width = `${String(popoverWidth)}px`;
		if (documentWidth - triggerRectLeft < popoverWidth) {
			popoverElement.style.right = '0';
		} else {
			popoverElement.style.left = `${String(triggerRectLeft)}px`;
		}
	}

	/**
	 * ポップオーバーを非表示にする
	 *
	 * @param eventType - イベントの識別名
	 */
	#hide(eventType: string): void {
		const eventDetail: ToggleEventDetail = {
			newState: 'closed',
			eventType: eventType,
		};
		this.#popoverElement.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: eventDetail,
			}),
		);
	}

	/**
	 * `<link rel="preload" as="image" />` を生成する
	 */
	#imagePreloadElementCreate(): void {
		if (this.#preloadProcessed) {
			/* 生成処理は1回のみ */
			return;
		}
		this.#preloadProcessed = true;

		const popoverHideImageSrc = this.#popoverHide.imageSrc;

		if (
			popoverHideImageSrc !== undefined &&
			!popoverHideImageSrc.startsWith('data:') &&
			document.querySelector(`link[rel="preload"][as="image"][href="${popoverHideImageSrc}"]`) === null
		) {
			const parentElement = document.head;

			const preloadElement = document.createElement('link');
			preloadElement.rel = 'preload';
			preloadElement.as = 'image';
			preloadElement.href = popoverHideImageSrc;

			const alreadyHeadLinkElements = parentElement.querySelectorAll('link');
			if (alreadyHeadLinkElements.length === 0) {
				parentElement.appendChild(preloadElement);
			} else {
				[...alreadyHeadLinkElements].at(-1)?.insertAdjacentElement('afterend', preloadElement);
			}
		}
	}
}
