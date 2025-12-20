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

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	const delay = 100;

	mouseenterEvent(event, {
		popoverElement: popoverElement,
		delay: delay,
		preloadImageSrc: 'foo.svg',
	});

	expect(popoverElement.isConnected).toBeFalsy();
	expect(popoverElement.state).toBeUndefined();

	await sleep(delay);

	expect(popoverElement.isConnected).toBeTruthy();
	expect(popoverElement.state).toBe('open');
});
