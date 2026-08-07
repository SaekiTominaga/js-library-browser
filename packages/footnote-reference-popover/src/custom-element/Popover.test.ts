import { beforeAll, describe, expect, test } from '@jest/globals';
import PopoverElement from './Popover.ts';

const POPOVER_ELEMENT_NAME = 'x-popover';

customElements.define(POPOVER_ELEMENT_NAME, PopoverElement);

describe('slot', () => {
	test('ID remove', () => {
		document.body.innerHTML = `<x-popover><span id="xxx">text</span></x-popover>`;

		const $span = document.querySelector('span');
		expect($span?.textContent).toBe('text');
		expect($span?.id).toBe('');
	});

	test('ignore-selectors', () => {
		document.body.innerHTML = `<x-popover ignore-selectors=".foo"><span class="foo"></span><span class="bar"></span></x-popover>`;

		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect($popover.ignoreSelectors).toBe('.foo');
		expect($popover.querySelector('.foo')).toBeNull();
		expect($popover.querySelector('.bar')).not.toBeNull();
	});
});

describe('attributes', () => {
	describe('hide-text', () => {
		beforeAll(() => {
			document.body.innerHTML = `<x-popover hide-text="hide"></x-popover>`;
		});

		test('init', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonText = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			expect($popover.hideText).toBe('hide');
			expect($hideButtonText?.innerHTML).toBe('hide');
			expect($hideButtonImage?.hidden).toBeTruthy();
		});

		test('hideText = null', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonText = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			$popover.hideText = null;

			expect($popover.hideText).toBe('Close');
			expect($hideButtonText?.innerHTML).toBe('Close');
			expect($hideButtonImage?.hidden).toBeTruthy();
		});
	});

	describe('hide-image-XXX', () => {
		beforeAll(() => {
			document.body.innerHTML = `<x-popover hide-text="hide" hide-image-src="hide.svg" hide-image-width="10" hide-image-height="20"></x-popover>`;
		});

		test('init', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonText = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			expect($popover.hideText).toBe('hide');
			expect($popover.hideImageSrc).toBe('http://localhost/hide.svg');
			expect($popover.hideImageWidth).toBe(10);
			expect($popover.hideImageHeight).toBe(20);
			expect($hideButtonText?.hidden).toBeTruthy();
			expect($hideButtonText?.innerHTML).toBe('hide');
			expect($hideButtonImage?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" width="10" height="20">');
		});

		test('hideImageWidth = null', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			$popover.hideImageWidth = null;

			expect($popover.hideImageWidth).toBe(0);
			expect($hideButtonImage?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" height="20" width="0">');
		});

		test('hideImageHeight = null', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			$popover.hideImageHeight = null;

			expect($popover.hideImageHeight).toBe(0);
			expect($hideButtonImage?.outerHTML).toBe('<img part="hide-button-image" alt="hide" src="hide.svg" width="0" height="0">');
		});

		test('hideImageSrc = null', () => {
			const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;
			const $hideButtonText = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-text]');
			const $hideButtonImage = $popover.shadowRoot?.querySelector<HTMLElement>('[part=hide-button-image]');

			$popover.hideImageSrc = null;

			expect($hideButtonText?.hidden).toBeFalsy();
			expect($hideButtonImage?.hidden).toBeTruthy();
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
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect($popover.width).toBe(0); // TODO: jsdom では常に 0 が返ってきてしまう https://github.com/jsdom/jsdom/issues/3729
	});

	test('hideButtonElement', () => {
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect($popover.hideButtonElement.getAttribute('part')).toBe('hide-button');
	});

	test('triggerElement', () => {
		const $trigger = document.querySelector('a');
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME)!;

		expect($popover.triggerElement).toBeUndefined();

		$popover.triggerElement = $trigger ?? undefined;

		expect($popover.triggerElement instanceof HTMLAnchorElement).toBeTruthy();
	});
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

describe('focus', () => {
	beforeAll(() => {
		document.body.innerHTML = `<x-popover></x-popover>`;
	});

	test('first-focusable', () => {
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);

		const $hideButton = $popover?.shadowRoot?.querySelector<HTMLElement>('[part="hide-button"]');
		const $firstFocusable = $popover?.shadowRoot?.querySelector<HTMLElement>('#first-focusable');

		$firstFocusable?.focus();
		expect($popover?.shadowRoot?.activeElement === $hideButton).toBeTruthy();
	});

	test('last-focusable', () => {
		const $popover = document.querySelector<PopoverElement>(POPOVER_ELEMENT_NAME);
		const $content = $popover?.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
		const $lastFocusable = $popover?.shadowRoot?.querySelector<HTMLElement>('#last-focusable');

		$lastFocusable?.focus();
		expect($popover?.shadowRoot?.activeElement === $content).toBeTruthy();
	});
});
