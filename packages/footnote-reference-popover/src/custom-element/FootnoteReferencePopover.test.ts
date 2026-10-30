import { beforeAll, describe, expect, test } from '@jest/globals';
import FootnoteReferencePopover from './FootnoteReferencePopover.ts';

beforeAll(() => {
	customElements.define('fn-ref', FootnoteReferencePopover);
});

describe('slot=anchor', () => {
	test('no element', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `<fn-ref></fn-ref>`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(Error);
		expect(errors[0]?.message).toBe('Element `[slot=anchor]` not found');
	});

	test('element name mismatch', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `<fn-ref><p slot="anchor"></p></fn-ref>`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(TypeError);
		expect(errors[0]?.message).toBe('Element `[slot=anchor]` must be a `<a>` element');
	});

	test('init attributes', () => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo"></p>
`;

		const $anchor = document.querySelector('a')!;

		expect($anchor.role).toBe('button');
		expect($anchor.ariaExpanded).toBe('false');
	});
});

describe('popover', () => {
	test('anchor size', () => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo"></p>
`;

		const $popover = document.querySelector('fn-ref')!.shadowRoot?.querySelector<HTMLElement>('#popover');

		expect($popover?.ariaLabel).toBeNull();
		expect($popover?.dataset['anchorWidth']).toBeDefined();
		expect($popover?.dataset['anchorHeight']).toBeDefined();
	});

	test('label', () => {
		document.body.innerHTML = `
			<fn-ref popover-label="Label">
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo"></p>
`;

		const $popover = document.querySelector('fn-ref')!.shadowRoot?.querySelector<HTMLElement>('#popover');

		expect($popover?.ariaLabel).toBe('Label');
	});
});

describe('popover content', () => {
	test('copy content', () => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo"><em>Footnote</em></p>
`;

		const $popoverContent = document.querySelector('fn-ref > [slot="popover__content"]');

		expect($popoverContent?.innerHTML).toBe('<em>Footnote</em>');
	});
});

describe('popover hide button', () => {
	test('default text', () => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo"></p>
`;

		const $popoverHideButton = document.querySelector('fn-ref')!.shadowRoot?.querySelector<HTMLButtonElement>('[part~="popover__hide"]');

		expect($popoverHideButton?.innerHTML.trim()).toBe('<slot name="popover__hide">Close</slot>');
	});

	test('element name mismatch', () => {
		const errors: Error[] = [];
		const onError = (event: ErrorEvent) => {
			event.preventDefault();
			errors.push(event.error as Error);
		};
		globalThis.addEventListener('error', onError);

		try {
			document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
				<p slot="popover__hide"></p>
			</fn-ref>
			<p id="foo"></p>
`;
		} finally {
			globalThis.removeEventListener('error', onError);
		}

		expect(errors).toHaveLength(1);
		expect(errors[0]).toBeInstanceOf(TypeError);
		expect(errors[0]?.message).toBe('Element `[slot=popover__hide]` must be a `<template>` element');
	});

	test('custom html', () => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
				<template slot="popover__hide">
					<img src="popover-close.svg" alt="Close" width="12" height="12" />
				</template>
			</fn-ref>
			<p id="foo"></p>
`;

		const $popoverHideButton = document.querySelector('fn-ref')!.shadowRoot?.querySelector<HTMLButtonElement>('[part~="popover__hide"]');

		expect($popoverHideButton?.innerHTML.trim()).toMatch(
			/<slot name="popover__hide">Close<\/slot>\n\t+\n\t+<img src="popover-close.svg" alt="Close" width="12" height="12">/u,
		);
	});
});

describe('attributes', () => {
	beforeAll(() => {
		document.body.innerHTML = `
			<fn-ref>
				<a href="#foo" slot="anchor"></a>
			</fn-ref>
			<p id="foo">text<em>em</em><strong>strong</strong></p>
`;
	});

	test('ignore', () => {
		const $fnRef = document.querySelector<FootnoteReferencePopover>('fn-ref')!;
		const $popoverContent = $fnRef.querySelector<HTMLElement>(':scope > [slot="popover__content"]')!;

		expect($fnRef.ignore).toBeUndefined();
		expect($popoverContent.innerHTML).toBe('text<em>em</em><strong>strong</strong>');

		$fnRef.ignore = 'em';
		expect($fnRef.ignore).toBe('em');
		expect($popoverContent.innerHTML).toBe('text<strong>strong</strong>');

		$fnRef.ignore = undefined;
		expect($fnRef.ignore).toBeUndefined();
		expect($popoverContent.innerHTML).toBe('text<em>em</em><strong>strong</strong>');

		$fnRef.setAttribute('ignore', 'strong');
		expect($popoverContent.innerHTML).toBe('text<em>em</em>');
	});

	test('popover-label', () => {
		const $fnRef = document.querySelector<FootnoteReferencePopover>('fn-ref')!;
		const $popover = $fnRef.shadowRoot?.querySelector<HTMLElement>('#popover');

		expect($fnRef.popoverLabel).toBeUndefined();
		expect($popover?.ariaLabel).toBeNull();

		$fnRef.popoverLabel = 'foo1';
		expect($fnRef.popoverLabel).toBe('foo1');
		expect($popover?.ariaLabel).toBe('foo1');

		$fnRef.popoverLabel = undefined;
		expect($fnRef.popoverLabel).toBeUndefined();
		expect($popover?.ariaLabel).toBeNull();

		$fnRef.setAttribute('popover-label', 'foo2');
		expect($fnRef.popoverLabel).toBe('foo2');
		expect($popover?.ariaLabel).toBe('foo2');
	});

	test('popover-delay-mouseenter', () => {
		const $fnRef = document.querySelector<FootnoteReferencePopover>('fn-ref')!;

		expect($fnRef.popoverDelayMouseenter).toBeUndefined();

		$fnRef.popoverDelayMouseenter = 'foo1';
		expect($fnRef.popoverDelayMouseenter).toBe('foo1');

		$fnRef.popoverDelayMouseenter = undefined;
		expect($fnRef.popoverDelayMouseenter).toBeUndefined();

		$fnRef.setAttribute('popover-delay-mouseenter', 'foo2');
		expect($fnRef.popoverDelayMouseenter).toBe('foo2');
	});

	test('popover-delay-mouseleave', () => {
		const $fnRef = document.querySelector<FootnoteReferencePopover>('fn-ref')!;

		expect($fnRef.popoverDelayMouseleave).toBeUndefined();

		$fnRef.popoverDelayMouseleave = 'foo1';
		expect($fnRef.popoverDelayMouseleave).toBe('foo1');

		$fnRef.popoverDelayMouseleave = undefined;
		expect($fnRef.popoverDelayMouseleave).toBeUndefined();

		$fnRef.setAttribute('popover-delay-mouseleave', 'foo2');
		expect($fnRef.popoverDelayMouseleave).toBe('foo2');
	});
});
