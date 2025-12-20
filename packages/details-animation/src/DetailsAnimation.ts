import Duration from './attribute/Duration.ts';
import Easing from './attribute/Easing.ts';
import PreOpen from './attribute/PreOpen.ts';
import detailsToggleEvent from './event/details/toggle.ts';
import detailsContentAnimationFinishEvent from './event/details-content/animation-finish.ts';
import summaryClickEvent from './event/summary/click.ts';
import DetailsContentElement, { type AnimationFinishEventDetail } from './custom-element/DetailsContent.ts';

const DETAILS_CONTENT_ELEMENT_NAME = 'x-details-content';

/**
 * Animating the `<details>` element
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLDetailsElement): void => {
	const { open } = thisElement;
	const { duration: durationAttribute, easing: easingAttribute } = thisElement.dataset;

	const duration = new Duration(durationAttribute ?? '500');
	const easing = new Easing(easingAttribute ?? 'ease');

	const summaryElement = thisElement.querySelector<HTMLElement>(':scope > summary');
	if (summaryElement === null) {
		throw new Error('Element `<details>` is missing a required instance of child element `<summary>`.');
	}

	const preOpenAttribute = new PreOpen(thisElement);
	preOpenAttribute.state = open;

	/* <summary> を除くノードをラップする */
	const fragment = document.createDocumentFragment();
	let nextNode = summaryElement.nextSibling;
	// eslint-disable-next-line functional/no-loop-statements
	while (nextNode !== null) {
		fragment.appendChild(nextNode);
		nextNode = summaryElement.nextSibling;
	}

	if (customElements.get(DETAILS_CONTENT_ELEMENT_NAME) === undefined) {
		customElements.define(DETAILS_CONTENT_ELEMENT_NAME, DetailsContentElement);
	}

	const detailsContentElement = document.createElement(DETAILS_CONTENT_ELEMENT_NAME) as DetailsContentElement;
	detailsContentElement.duration = duration;
	detailsContentElement.easing = easing;
	detailsContentElement.appendChild(fragment);
	summaryElement.insertAdjacentElement('afterend', detailsContentElement);

	thisElement.addEventListener(
		'toggle',
		(ev: Event) => {
			detailsToggleEvent(ev, thisElement, {
				preOpen: preOpenAttribute,
			});
		},
		{ passive: true },
	);
	summaryElement.addEventListener('click', (ev: MouseEvent) => {
		summaryClickEvent(ev, thisElement, detailsContentElement, {
			preOpen: preOpenAttribute,
		});
	});
	detailsContentElement.addEventListener(
		'animation-finish',
		((ev: CustomEvent<AnimationFinishEventDetail>) => {
			detailsContentAnimationFinishEvent(ev, thisElement);
		}) as (ev: Event) => void,
		{
			passive: true,
		},
	);
};
