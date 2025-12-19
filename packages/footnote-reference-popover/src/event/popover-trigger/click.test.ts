import { beforeAll, expect, jest, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import clickEvent from './click.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

beforeAll(() => {
	/* Popover https://github.com/jsdom/jsdom/issues/3721 */
	HTMLElement.prototype.showPopover = jest.fn();

	/* CSSStyleSheet https://github.com/jsdom/jsdom/issues/3766 */
	CSSStyleSheet.prototype.replaceSync = jest.fn();
});

test('popover status', () => {
	const event = new MouseEvent('click');

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	expect(popoverElement.isConnected).toBeFalsy();
	expect(popoverElement.state).toBeUndefined();

	clickEvent(event, popoverElement);

	expect(popoverElement.isConnected).toBeTruthy();
	expect(popoverElement.state).toBe('open');
});
