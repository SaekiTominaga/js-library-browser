import { beforeAll, expect, test } from '@jest/globals';
import PopoverElement from '../../custom-element/Popover.ts';
import pointerleaveEvent from './pointerleave.ts';

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
	const event = new MouseEvent('pointerenter'); // TODO: 本来は PointerEvent <https://github.com/jestjs/jest/issues/16000>
	// @ts-expect-error: ts(2339)
	event.pointerType = 'mouse';

	const $popover = document.createElement(POPOVER_ELEMENT_NAME) as PopoverElement;
	document.body.append($popover);

	const delay = 100;

	// @ts-expect-error: ts(2345)
	pointerleaveEvent(event, {
		popoverElement: $popover,
		delay: delay,
	});

	expect($popover.state).toBeUndefined();

	await sleep(delay);

	expect($popover.isConnected).toBeTruthy();
	expect($popover.state).toBe('closed');
});
