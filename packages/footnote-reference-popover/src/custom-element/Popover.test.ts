import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import PopoverElement from './Popover.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

beforeAll(() => {
	HTMLElement.prototype.showPopover = jest.fn();
	HTMLElement.prototype.hidePopover = jest.fn();
}); // jsdom が Popover をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3721

describe('slot', () => {
	test('ID remove', () => {
		document.body.innerHTML = `<x-popover><span id="xxx">text</span></x-popover>`;

		const spanElement = document.querySelector('span');
		expect(spanElement?.textContent).toBe('text');
		expect(spanElement?.id).toBe('');
	});
});

describe('attributes', () => {
	describe('hide-text', () => {
		beforeAll(() => {
			document.body.innerHTML = `<x-popover hide-text="hide"></x-popover>`;
		});

		test('init', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonTextElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			expect(popoverElement.hideText).toBe('hide');
			expect(hideButtonTextElement?.innerHTML).toBe('hide');
			expect(hideButtonImageElement?.hidden).toBeTruthy();
		});

		test('hideText = null', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonTextElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			popoverElement.hideText = null;

			expect(popoverElement.hideText).toBe('Close');
			expect(hideButtonTextElement?.innerHTML).toBe('Close');
			expect(hideButtonImageElement?.hidden).toBeTruthy();
		});
	});

	describe('hide-image-XXX', () => {
		beforeAll(() => {
			document.body.innerHTML = `<x-popover hide-text="hide" hide-image-src="hide.svg" hide-image-width="10" hide-image-height="20"></x-popover>`;
		});

		test('init', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonTextElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			expect(popoverElement.hideText).toBe('hide');
			expect(popoverElement.hideImageSrc).toBe('http://localhost/hide.svg');
			expect(popoverElement.hideImageWidth).toBe(10);
			expect(popoverElement.hideImageHeight).toBe(20);
			expect(hideButtonTextElement?.hidden).toBeTruthy();
			expect(hideButtonTextElement?.innerHTML).toBe('hide');
			expect(hideButtonImageElement?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" width="10" height="20">');
		});

		test('hideImageWidth = null', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			popoverElement.hideImageWidth = null;

			expect(popoverElement.hideImageWidth).toBe(0);
			expect(hideButtonImageElement?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" height="20" width="0">');
		});

		test('hideImageHeight = null', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			popoverElement.hideImageHeight = null;

			expect(popoverElement.hideImageHeight).toBe(0);
			expect(hideButtonImageElement?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" width="0" height="0">');
		});

		test('hideImageSrc = null', () => {
			const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const hideButtonTextElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const hideButtonImageElement = popoverElement.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			popoverElement.hideImageSrc = null;

			expect(hideButtonTextElement?.hidden).toBeFalsy();
			expect(hideButtonImageElement?.hidden).toBeTruthy();
		});
	});
});

describe('properties', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a></a>
<x-popover></x-popover>
`;
	});

	test('width', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect(popoverElement.width).toBe(0); // TODO: jsdom では常に 0 が返ってきてしまう https://github.com/jsdom/jsdom/issues/3729
	});

	test('hideButtonElement', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect(popoverElement.hideButtonElement.getAttribute('part')).toBe('hide-button');
	});

	test('triggerElement', () => {
		const triggerElement = document.querySelector('a');
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect(popoverElement.triggerElement).toBeUndefined();

		popoverElement.triggerElement = triggerElement ?? undefined;

		expect(popoverElement.triggerElement instanceof HTMLAnchorElement).toBeTruthy();
	});
});

describe('custom toggle event', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-popover></x-popover>`;
	});

	test('open', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		popoverElement?.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: {
					newState: 'open',
				},
			}),
		);

		expect(popoverElement?.isConnected).toBeTruthy();
		expect(popoverElement?.state).toBe('open');
	});

	test('close', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		popoverElement?.dispatchEvent(
			new CustomEvent('my-toggle', {
				detail: {
					newState: 'closed',
				},
			}),
		);

		expect(popoverElement?.isConnected).toBeTruthy();
		expect(popoverElement?.state).toBe('closed');
	});
});

describe('focus', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-popover></x-popover>`;
	});

	test('first-focusable', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);

		const hideButtonElement = popoverElement?.shadowRoot?.querySelector<HTMLElement>('[part="hide-button"]');
		const firstFocusableElement = popoverElement?.shadowRoot?.querySelector<HTMLElement>('#first-focusable');

		firstFocusableElement?.focus();
		expect(popoverElement?.shadowRoot?.activeElement === hideButtonElement).toBeTruthy();
	});

	test('last-focusable', () => {
		const popoverElement = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		const contentElement = popoverElement?.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
		const lastFocusableElement = popoverElement?.shadowRoot?.querySelector<HTMLElement>('#last-focusable');

		lastFocusableElement?.focus();
		expect(popoverElement?.shadowRoot?.activeElement === contentElement).toBeTruthy();
	});
});
