import { beforeAll, expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import clickEvent from './click.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

beforeAll(() => {
	customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
});

test('popover status', () => {
	const event = new MouseEvent('click');

	const $popover = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	expect($popover.isConnected).toBeFalsy();
	expect($popover.state).toBeUndefined();

	clickEvent(event, {
		popoverElement: $popover,
	});

	expect($popover.isConnected).toBeTruthy();
	expect($popover.state).toBe('open');
});
