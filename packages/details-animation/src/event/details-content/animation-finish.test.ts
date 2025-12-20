import { expect, test } from '@jest/globals';
import { ANIMATION_FINISH_EVENT_TYPE, type AnimationFinishEventDetail } from '../../custom-element/DetailsContent.ts';
import animationFinishEvent from './animation-finish.ts';

test('close → open', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>(ANIMATION_FINISH_EVENT_TYPE, {
		detail: {
			orientation: 'open',
		},
	});

	const detailsElement = document.createElement('details');

	expect(detailsElement.open).toBeFalsy();

	animationFinishEvent(event, {
		detailsElement: detailsElement,
	});
	expect(detailsElement.open).toBeFalsy(); // 変化しない
});

test('open → close', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>(ANIMATION_FINISH_EVENT_TYPE, {
		detail: {
			orientation: 'close',
		},
	});

	const detailsElement = document.createElement('details');

	detailsElement.open = true;
	expect(detailsElement.open).toBeTruthy();

	animationFinishEvent(event, {
		detailsElement: detailsElement,
	});
	expect(detailsElement.open).toBeFalsy();
});
