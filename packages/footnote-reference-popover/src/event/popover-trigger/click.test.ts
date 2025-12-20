import { expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import clickEvent from './click.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

test('popover status', () => {
	const event = new MouseEvent('click');

	const popoverElement = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	expect(popoverElement.isConnected).toBeFalsy();
	expect(popoverElement.state).toBeUndefined();

	clickEvent(event, {
		popoverElement: popoverElement,
	});

	expect(popoverElement.isConnected).toBeTruthy();
	expect(popoverElement.state).toBe('open');
});
