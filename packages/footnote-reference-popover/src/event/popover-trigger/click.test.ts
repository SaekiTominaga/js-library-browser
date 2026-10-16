import { beforeAll, expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import clickEvent from './click.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

beforeAll(() => {
	customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
});

test('popover status', () => {
	const event = new MouseEvent('pointerenter'); // TODO: 本来は PointerEvent <https://github.com/jestjs/jest/issues/16000>
	// @ts-expect-error: ts(2339)
	event.pointerType = '';

	const $popover = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;

	expect($popover.isConnected).toBeFalsy();
	expect($popover.state).toBeUndefined();

	// @ts-expect-error: ts(2345)
	clickEvent(event, {
		popoverElement: $popover,
	});

	expect($popover.isConnected).toBeTruthy();
	expect($popover.state).toBe('open');
});
