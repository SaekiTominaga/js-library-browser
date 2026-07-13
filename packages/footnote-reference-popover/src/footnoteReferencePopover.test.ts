import { beforeAll, describe, expect, test } from '@jest/globals';
import type PopoverElement from './custom-element/Popover.ts';
import footnoteReferencePopover from './footnoteReferencePopover.ts';

describe('attribute', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a
	href="#footnote"
	data-popover-label="Note"
	data-popover-class="my-popover"></a>
<p id="footnote"></p>
`;

		footnoteReferencePopover(document.querySelector('a')!);
	});

	test('trriger role', () => {
		expect(document.querySelector('a')?.getAttribute('role')).toBe('button');
	});

	test('popover attributes', () => {
		document.querySelector('a')?.dispatchEvent(new UIEvent('click'));

		const $popover = document.querySelector<PopoverElement>('x-popover');
		expect($popover?.popover).toBe('');
		expect($popover?.getAttribute('class')).toBe('my-popover');
		expect($popover?.getAttribute('aria-label')).toBe('Note');
	});
});
