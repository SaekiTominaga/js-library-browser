import Duration from './attribute/Duration.ts';
import Easing from './attribute/Easing.ts';
import PreOpen from './attribute/PreOpen.ts';
import CustomElementDetailsContent, { type AnimationFinishEventDetail } from './custom-element/DetailsContent.ts';

customElements.define('x-details-content', CustomElementDetailsContent);

/**
 * Animating the `<details>` element
 */
export default class {
	readonly #detailsElement: HTMLDetailsElement; // `<details>` 要素

	readonly #preOpenAttribute: PreOpen; // `data-pre-open` 属性

	readonly #detailsContentElement: CustomElementDetailsContent; // `<details>` 要素内の `<summary>` 要素を除くコンテンツを囲う要素

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLDetailsElement) {
		this.#detailsElement = thisElement;

		const { open } = thisElement;
		const { duration: durationAttribute, easing: easingAttribute } = thisElement.dataset;

		const duration = new Duration(durationAttribute ?? '500');
		const easing = new Easing(easingAttribute ?? 'ease');

		const summaryElement = thisElement.querySelector('summary');
		if (summaryElement === null) {
			throw new Error('Element `<details>` is missing a required instance of child element `<summary>`.');
		}

		this.#preOpenAttribute = new PreOpen(thisElement);
		this.#preOpenAttribute.state = open;

		/* <summary> を除くノードをラップする */
		const fragment = document.createDocumentFragment();
		let nextNode = summaryElement.nextSibling;
		// eslint-disable-next-line functional/no-loop-statements
		while (nextNode !== null) {
			fragment.appendChild(nextNode);
			nextNode = summaryElement.nextSibling;
		}

		const detailsContentElement = document.createElement('x-details-content') as CustomElementDetailsContent;
		detailsContentElement.duration = duration;
		detailsContentElement.easing = easing;
		detailsContentElement.appendChild(fragment);
		summaryElement.insertAdjacentElement('afterend', detailsContentElement);
		this.#detailsContentElement = detailsContentElement;

		thisElement.addEventListener('toggle', this.#detailsToggleEvent, { passive: true });
		summaryElement.addEventListener('click', this.#summaryClickEvent);
		detailsContentElement.addEventListener('animation-finish', this.#detailsContentAnimationFinishEvent as (ev: Event) => void, {
			passive: true,
		});
	}

	/**
	 * `<details>` 要素の開閉状態が変化した時の処理
	 */
	readonly #detailsToggleEvent = (): void => {
		const { open } = this.#detailsElement;

		if (this.#preOpenAttribute.state !== open) {
			/* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
			this.#preOpenAttribute.state = open;
		}
	};

	/**
	 * `<summary>` 要素をクリックしたときの処理
	 *
	 * @param ev - Event
	 */
	readonly #summaryClickEvent = (ev: Event): void => {
		ev.preventDefault();

		this.#preOpenAttribute.toggle();

		if (this.#preOpenAttribute.state) {
			this.#detailsElement.open = true;

			this.#detailsContentElement.open();
		} else {
			this.#detailsContentElement.close();
		}
	};

	/**
	 * 開閉アニメーションが終了したときの処理
	 *
	 * @param ev - Event
	 */
	readonly #detailsContentAnimationFinishEvent = (ev: CustomEvent<AnimationFinishEventDetail>): void => {
		const { detail } = ev;

		switch (detail.orientation) {
			case 'close': {
				this.#detailsElement.open = false;

				break;
			}
			default:
		}
	};
}
