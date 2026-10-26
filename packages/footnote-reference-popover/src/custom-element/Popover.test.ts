import { beforeAll, describe, expect, test } from '@jest/globals';
import PopoverElement from './Popover.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

beforeAll(() => {
	customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);
});

describe('custom toggle event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-popover></x-popover>`;
	});

	test('open', () => {
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		$popover?.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: {
					newState: 'open',
				},
			}),
		);

		expect($popover?.isConnected).toBeTruthy();
		expect($popover?.state).toBe('open');
	});

	test('close', () => {
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		$popover?.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: {
					newState: 'closed',
				},
			}),
		);

		expect($popover?.isConnected).toBeTruthy();
		expect($popover?.state).toBe('closed');
	});
});
