import FootnoteElementAttribute from './attribute/FootnoteElement.ts';
import MouseenterAttribute from './attribute/Mouseenter.ts';
import MouseleaveAttribute from './attribute/Mouseleave.ts';
import PopoverClassAttribute from './attribute/PopoverClass.ts';
import PopoverHideAttribute from './attribute/PopoverHide.ts';
import PopoverLabelAttribute from './attribute/PopoverLabel.ts';
import PopoverElement, { type ToggleEventDetail } from './custom-element/Popover.ts';
import popoverMouseenterEvent from './event/popover/mouseenter.ts';
import popoverMouseleaveEvent from './event/popover/mouseleave.ts';
import popoverHiddenButtonClickEvent from './event/popover-hidden-button/click.ts';
import popoverTriggerClickEvent from './event/popover-trigger/click.ts';
import popoverTriggerMouseenterEvent from './event/popover-trigger/mouseenter.ts';
import popoverTriggerMouseleaveEvent from './event/popover-trigger/mouseleave.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

/**
 * ポップオーバーを表示する
 *
 * @param eventType - イベントの識別名
 * @param popover - PopoverElement
 */
export const show = (eventType: string, popover: PopoverElement): void => {
	if (!popover.isConnected) {
		/* 初回表示時はポップオーバーの挿入を行う */
		document.body.appendChild(popover);
	}

	const triggerRect = popover.triggerElement?.getBoundingClientRect();

	if (triggerRect !== undefined) {
		/* ポップオーバーの上位置を設定（トリガー要素の下端を基準にする） */
		popover.style.width = 'auto';
		popover.style.top = `${String(Math.round(triggerRect.bottom) + window.scrollY)}px`;
		popover.style.right = 'auto';
		popover.style.left = 'auto';
	}

	/* ポップオーバーを表示 */
	const eventDetail: ToggleEventDetail = {
		newState: 'open',
		eventType: eventType,
	};
	popover.dispatchEvent(
		new CustomEvent('my-toggle', {
			detail: eventDetail,
		}),
	);

	if (triggerRect !== undefined) {
		/* ポップオーバーの左右位置を設定（トリガー要素の左端を基準にする） */
		const documentWidth = document.documentElement.offsetWidth;
		const popoverWidth = popover.width;
		const triggerRectLeft = triggerRect.left;

		popover.style.width = `${String(popoverWidth)}px`;
		if (documentWidth - triggerRectLeft < popoverWidth) {
			popover.style.right = '0';
		} else {
			popover.style.left = `${String(triggerRectLeft)}px`;
		}
	}
};

/**
 * ポップオーバーを非表示にする
 *
 * @param eventType - イベントの識別名
 * @param popover - PopoverElement
 */
export const hide = (eventType: string, popover: PopoverElement): void => {
	const eventDetail: ToggleEventDetail = {
		newState: 'closed',
		eventType: eventType,
	};
	popover.dispatchEvent(
		new CustomEvent('my-toggle', {
			detail: eventDetail,
		}),
	);
};

/**
 * Footnote reference popover
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLAnchorElement): void => {
	if (!('showPopover' in thisElement)) {
		console.info('This browser does not support popover');
		return;
	}

	const { href: hrefAttributeValue } = thisElement;
	const {
		popoverLabel: popoverLabelAttributeValue,
		popoverClass: popoverClassAttributeValue,
		popoverHideText: popoverHideTextAttributeValue,
		popoverHideImageSrc: popoverHideImageSrcAttributeValue,
		popoverHideImageWidth: popoverHideImageWidthAttributeValue,
		popoverHideImageHeight: popoverHideImageHeightAttributeValue,
		mouseenterDelay: mouseenterDelayAttributeValue,
		mouseleaveDelay: mouseleaveDelayAttributeValue,
	} = thisElement.dataset;

	const footnoteElement = new FootnoteElementAttribute(hrefAttributeValue);
	const popoverLabel = new PopoverLabelAttribute(popoverLabelAttributeValue);
	const popoverClass = new PopoverClassAttribute(popoverClassAttributeValue);
	const popoverHide = new PopoverHideAttribute({
		text: popoverHideTextAttributeValue,
		imageSrc: popoverHideImageSrcAttributeValue,
		imageWidth: popoverHideImageWidthAttributeValue,
		imageHeight: popoverHideImageHeightAttributeValue,
	});
	const mouseenter = new MouseenterAttribute({ delay: mouseenterDelayAttributeValue ?? '250' });
	const mouseleave = new MouseleaveAttribute({ delay: mouseleaveDelayAttributeValue ?? '250' });

	if (customElements.get(POPOVER_ELEMENT_NAME) === undefined) {
		customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
	}

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;
	if (popoverClass.name !== undefined) {
		popoverElement.className = popoverClass.name;
	}
	popoverElement.ariaLabel = popoverLabel.text ?? null;
	popoverElement.hideText = popoverHide.text ?? null;
	popoverElement.hideImageSrc = popoverHide.imageSrc ?? null;
	popoverElement.hideImageWidth = popoverHide.imageWidth ?? null;
	popoverElement.hideImageHeight = popoverHide.imageHeight ?? null;
	popoverElement.triggerElement = thisElement;
	popoverElement.insertAdjacentHTML(
		'afterbegin',
		'getHTML' in footnoteElement.element ? footnoteElement.element.getHTML() : (footnoteElement.element as HTMLElement).innerHTML,
	);

	thisElement.setAttribute('role', 'button');

	thisElement.addEventListener('click', (ev: MouseEvent) => {
		popoverTriggerClickEvent(ev, popoverElement);
	});
	thisElement.addEventListener(
		'mouseenter',
		(ev: MouseEvent) => {
			popoverTriggerMouseenterEvent(ev, popoverElement, {
				delay: mouseenter.delay,
				preloadImageSrc: popoverHide.imageSrc,
			});
		},
		{ passive: true },
	);
	thisElement.addEventListener(
		'mouseleave',
		(ev: MouseEvent) => {
			popoverTriggerMouseleaveEvent(ev, popoverElement, {
				delay: mouseleave.delay,
			});
		},
		{ passive: true },
	);

	popoverElement.addEventListener(
		'mouseenter',
		(ev: MouseEvent) => {
			popoverMouseenterEvent(ev, popoverElement, {
				delay: mouseenter.delay,
			});
		},
		{ passive: true },
	);
	popoverElement.addEventListener(
		'mouseleave',
		(ev: MouseEvent) => {
			popoverMouseleaveEvent(ev, popoverElement, {
				delay: mouseenter.delay,
			});
		},
		{ passive: true },
	);

	popoverElement.hideButtonElement.addEventListener(
		'click',
		(ev: MouseEvent) => {
			popoverHiddenButtonClickEvent(ev, popoverElement);
		},
		{ passive: true },
	);
};
