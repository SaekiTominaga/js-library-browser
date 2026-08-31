import { expect, test } from '@jest/globals';
import { ANIMATION_FINISH_EVENT_TYPE, type AnimationFinishEventDetail } from '../../custom-element/DetailsContent.ts';
import animationFinishEvent from './animationFinish.ts';

test('close → open', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>(ANIMATION_FINISH_EVENT_TYPE, {
		detail: {
			orientation: 'open',
		},
	});

	const $details = document.createElement('details');

	expect($details.open).toBeFalsy();

	animationFinishEvent(event, {
		detailsElement: $details,
	});
	expect($details.open).toBeFalsy(); // 変化しない
});

test('open → close', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>(ANIMATION_FINISH_EVENT_TYPE, {
		detail: {
			orientation: 'close',
		},
	});

	const $details = document.createElement('details');

	$details.open = true;
	expect($details.open).toBeTruthy();

	animationFinishEvent(event, {
		detailsElement: $details,
	});
	expect($details.open).toBeFalsy();
});
