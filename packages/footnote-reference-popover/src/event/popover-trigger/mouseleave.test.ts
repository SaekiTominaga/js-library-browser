import { beforeAll, expect, jest, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import mouseleaveEvent from './mouseleave.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

beforeAll(() => {
	/* Popover https://github.com/jsdom/jsdom/issues/3721 */
	HTMLElement.prototype.hidePopover = jest.fn();

	/* CSSStyleSheet https://github.com/jsdom/jsdom/issues/3766 */
	CSSStyleSheet.prototype.replaceSync = jest.fn();
});

test('popover status', async () => {
	const event = new MouseEvent('mouseleave');

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;
	document.body.appendChild(popoverElement);

	const delay = 100;

	mouseleaveEvent(event, popoverElement, {
		delay: delay,
	});

	expect(popoverElement.state).toBeUndefined();

	await sleep(delay);

	expect(popoverElement.isConnected).toBeTruthy();
	expect(popoverElement.state).toBe('closed');
});
