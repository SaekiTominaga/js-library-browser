import FootnoteElementAttribute from './attribute/FootnoteElement.ts';
import IgnoreAttribute from './attribute/Ignore.ts';
import MouseenterAttribute from './attribute/Mouseenter.ts';
import MouseleaveAttribute from './attribute/Mouseleave.ts';
import PopoverClassAttribute from './attribute/PopoverClass.ts';
import PopoverHideAttribute from './attribute/PopoverHide.ts';
import PopoverLabelAttribute from './attribute/PopoverLabel.ts';
import PopoverElement, { type ToggleEventDetail } from './custom-element/Popover.ts';
import popoverHiddenButtonClickEvent from './event/popover-hidden-button/click.ts';
import popoverTriggerClickEvent from './event/popover-trigger/click.ts';
import popoverTriggerPointerenterEvent from './event/popover-trigger/pointerenter.ts';
import popoverTriggerPointerleaveEvent from './event/popover-trigger/pointerleave.ts';
import popoverPointerenterEvent from './event/popover/pointerenter.ts';
import popoverPointerleaveEvent from './event/popover/pointerleave.ts';
import { getUniqueCSSAnchorName } from './util/element.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

/**
 * ポップオーバーを表示する
 *
 * @param eventType - イベントの識別名
 * @param popover - PopoverElement
 */
const show = (eventType: string, popover: PopoverElement): void => {
	if (!popover.isConnected) {
		/* 初回表示時はポップオーバーの挿入を行う */
		document.body.append(popover);
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
};

/**
 * ポップオーバーを非表示にする
 *
 * @param eventType - イベントの識別名
 * @param popover - PopoverElement
 */
const hide = (eventType: string, popover: PopoverElement): void => {
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
 * @param $this - Target element
 */
export default ($this: HTMLAnchorElement): void => {
	const { href: hrefAttributeValue } = $this;
	const {
		ignore: ignoreAttributeValue,
		popoverLabel: popoverLabelAttributeValue,
		popoverClass: popoverClassAttributeValue,
		popoverHideText: popoverHideTextAttributeValue,
		popoverHideImageSrc: popoverHideImageSrcAttributeValue,
		popoverHideImageWidth: popoverHideImageWidthAttributeValue,
		popoverHideImageHeight: popoverHideImageHeightAttributeValue,
		mouseenterDelay: mouseenterDelayAttributeValue,
		mouseleaveDelay: mouseleaveDelayAttributeValue,
	} = $this.dataset;

	const footnoteElement = new FootnoteElementAttribute(hrefAttributeValue);
	const ignore = new IgnoreAttribute(ignoreAttributeValue);
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

	const cssAnchorName = getUniqueCSSAnchorName('fnref-');

	if (customElements.get(POPOVER_ELEMENT_NAME) === undefined) {
		customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
	}

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;
	if (popoverClass.name !== undefined) {
		popoverElement.className = popoverClass.name;
	}
	popoverElement.ignoreSelectors = ignore.selectors;
	if (popoverLabel.text !== undefined) {
		popoverElement.ariaLabel = popoverLabel.text;
	}
	popoverElement.hideText = popoverHide.text;
	popoverElement.hideImageSrc = popoverHide.imageSrc;
	popoverElement.hideImageWidth = popoverHide.imageWidth;
	popoverElement.hideImageHeight = popoverHide.imageHeight;
	popoverElement.triggerElement = $this;
	popoverElement.insertAdjacentHTML(
		'afterbegin',
		'getHTML' in footnoteElement.element ? footnoteElement.element.getHTML() : (footnoteElement.element as HTMLElement).innerHTML,
	);
	popoverElement.style.setProperty('position-anchor', cssAnchorName);

	$this.role = 'button';
	$this.style.setProperty('anchor-name', cssAnchorName);

	$this.addEventListener('click', (ev: PointerEvent) => {
		popoverTriggerClickEvent(ev, {
			popoverElement: popoverElement,
		});
	});
	$this.addEventListener(
		'pointerenter',
		(ev: PointerEvent) => {
			popoverTriggerPointerenterEvent(ev, {
				popoverElement: popoverElement,
				delay: mouseenter.delay,
				preloadImageSrc: popoverHide.imageSrc,
			});
		},
		{ passive: true },
	);
	$this.addEventListener(
		'pointerleave',
		(ev: PointerEvent) => {
			popoverTriggerPointerleaveEvent(ev, {
				popoverElement: popoverElement,
				delay: mouseleave.delay,
			});
		},
		{ passive: true },
	);

	popoverElement.addEventListener(
		'pointerenter',
		(ev: PointerEvent) => {
			popoverPointerenterEvent(ev, {
				delay: mouseenter.delay,
			});
		},
		{ passive: true },
	);
	popoverElement.addEventListener(
		'pointerleave',
		(ev: PointerEvent) => {
			popoverPointerleaveEvent(ev, {
				delay: mouseenter.delay,
			});
		},
		{ passive: true },
	);

	popoverElement.hideButtonElement.addEventListener(
		'click',
		(ev: PointerEvent) => {
			popoverHiddenButtonClickEvent(ev, {
				popoverElement: popoverElement,
			});
		},
		{ passive: true },
	);
};

export { show, hide };
