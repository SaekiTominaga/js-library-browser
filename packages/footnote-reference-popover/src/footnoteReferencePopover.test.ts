import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import type PopoverElement from './custom-element/Popover.ts';
import footnoteReferencePopover from './footnoteReferencePopover.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

describe('blowser support popover', () => {
	let tempShowPopover: () => void;

	beforeAll(() => {
		tempShowPopover = HTMLElement.prototype.showPopover.bind(HTMLElement);
		// @ts-expect-error: ts(2790)
		delete HTMLElement.prototype.showPopover;
	});
	afterAll(() => {
		HTMLElement.prototype.showPopover = tempShowPopover;
	});

	test('not support', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		footnoteReferencePopover(document.createElement('a'));

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support popover');

		consoleInfoSpy.mockRestore();
	});
});

describe('trigger click event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote"></p>
`;

		footnoteReferencePopover(document.querySelector('a')!);
	});

	test('init', () => {
		expect(document.querySelector('a')?.getAttribute('role')).toBe('button');
	});

	test('click', () => {
		document.querySelector('a')?.dispatchEvent(new UIEvent('click'));

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.isConnected).toBeTruthy();
		expect(popoverElement?.state).toBe('open');
	});
});

describe('trigger mouse event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote"></p>
`;

		footnoteReferencePopover(document.querySelector('a')!);
	});

	test('mouseenter', () => {
		document.querySelector('a')?.dispatchEvent(new MouseEvent('mouseenter'));

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.isConnected).toBeFalsy();
	});

	test('show', async () => {
		await sleep(250);

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.isConnected).toBeTruthy();
		expect(popoverElement?.state).toBe('open');
	});

	test('mouseleave', () => {
		document.querySelector('a')?.dispatchEvent(new MouseEvent('mouseleave'));

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.state).toBe('open');
	});

	test('hide', async () => {
		await sleep(250);

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.state).toBe('closed');
	});
});

describe('popover mouse event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote"></p>
`;

		footnoteReferencePopover(document.querySelector('a')!);
	});

	test('mouseenter', async () => {
		document.querySelector('a')?.dispatchEvent(new MouseEvent('mouseenter'));
		await sleep(250);
		document.querySelector('a')?.dispatchEvent(new MouseEvent('mouseleave'));
		await sleep(250);

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		popoverElement?.dispatchEvent(new MouseEvent('mouseenter'));

		expect(popoverElement?.state).toBe('closed');
	});

	test('show', async () => {
		await sleep(250);

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.state).toBe('open');
	});

	test('mouseleave', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		popoverElement?.dispatchEvent(new MouseEvent('mouseleave'));

		expect(popoverElement?.state).toBe('open');
	});

	test('hide', async () => {
		await sleep(250);

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		expect(popoverElement?.state).toBe('closed');
	});
});

describe('popover hide button click event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote"></a>
<p id="footnote"></p>
`;

		footnoteReferencePopover(document.querySelector('a')!);
	});

	test('click', () => {
		document.querySelector('a')?.dispatchEvent(new UIEvent('click'));

		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		popoverElement?.shadowRoot?.querySelector('[part=hide-button]')?.dispatchEvent(new UIEvent('click'));

		expect(popoverElement?.state).toBe('open'); // TODO: 本来は `closed` が正しいが、jsdom が Popover 未対応なため開いたままの扱いとなる
	});
});
