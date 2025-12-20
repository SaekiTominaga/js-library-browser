import { expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import mouseleaveEvent from './mouseleave.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

test('popover status', async () => {
	const event = new MouseEvent('mouseleave');

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;
	document.body.appendChild(popoverElement);

	const delay = 100;

	Object.defineProperty(event, 'currentTarget', { value: popoverElement, writable: false });
	mouseleaveEvent(event, {
		delay: delay,
	});

	expect(popoverElement.state).toBeUndefined();

	await sleep(delay);

	expect(popoverElement.isConnected).toBeTruthy();
	expect(popoverElement.state).toBe('closed');
});
