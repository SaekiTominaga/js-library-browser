import { expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import mouseenterEvent from './mouseenter.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

test('popover status', async () => {
	const event = new MouseEvent('mouseenter');

	const $popover = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	const delay = 100;

	mouseenterEvent(event, {
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
