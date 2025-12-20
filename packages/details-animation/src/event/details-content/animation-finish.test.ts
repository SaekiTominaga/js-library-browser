import { expect, test } from '@jest/globals';
import { type AnimationFinishEventDetail } from '../../custom-element/DetailsContent.ts';
import animationFinishEvent from './animation-finish.ts';

test('close → open', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>('animation-finish', {
		detail: {
			orientation: 'open',
		},
	});

	const detailsElement = document.createElement('details');

	expect(detailsElement.open).toBeFalsy();

	animationFinishEvent(event, detailsElement);
	expect(detailsElement.open).toBeFalsy(); // 変化しない
});

test('open → close', () => {
	const event = new CustomEvent<AnimationFinishEventDetail>('animation-finish', {
		detail: {
			orientation: 'close',
		},
	});

	const detailsElement = document.createElement('details');

	detailsElement.open = true;
	expect(detailsElement.open).toBeTruthy();

	animationFinishEvent(event, detailsElement);
	expect(detailsElement.open).toBeFalsy();
});
