import { beforeAll, expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import pointerenterEvent from './pointerenter.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

beforeAll(() => {
	customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
});

const sleep = (ms: number) =>
	// oxlint-disable-next-line promise/avoid-new
	new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

test('popover status', async () => {
	const event = new PointerEvent('pointerenter', {
		pointerType: 'mouse',
	});

	const $popover = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	const delay = 100;

	pointerenterEvent(event, {
		popoverElement: $popover,
		delay: delay,
		preloadImageSrc: 'foo.svg',
	});

	expect($popover.isConnected).toBeFalsy();
	expect($popover.state).toBeUndefined();

	await sleep(delay);

	expect($popover.isConnected).toBeTruthy();
	expect($popover.state).toBe('open');
});
