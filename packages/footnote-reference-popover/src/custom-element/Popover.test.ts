import { describe, beforeAll, afterAll, afterEach, test, expect, jest } from '@jest/globals';
import CustomElementPopover from './Popover.ts';

customElements.define('x-popover', CustomElementPopover);

beforeAll(() => {
	CustomElementPopover.prototype.showPopover = jest.fn();
	CustomElementPopover.prototype.hidePopover = jest.fn();
}); // `jsdom` が Popover をサポートするまでの暫定処理 https://github.com/jsdom/jsdom/issues/3294

describe('connected & disconnected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover>text</x-popover>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<x-popover>text</x-popover>');
	});

	test('disconnected', () => {
		document.querySelector('x-popover')?.remove();
	});
});

describe('attributeChanged', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('label', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover label="label">text</x-popover>');

		expect(document.querySelector<CustomElementPopover>('x-popover')?.label).toBe('label');
	});

	test('hide-text', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover hide-text="hide">text</x-popover>');

		expect(document.querySelector<CustomElementPopover>('x-popover')?.hideText).toBe('hide');
	});

	test('hide-image-src', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover hide-image-src="hide.svg">text</x-popover>');

		const element = document.querySelector<CustomElementPopover>('x-popover');

		expect(element?.hideText).toBe('Close');
		expect(element?.hideImageSrc).toBe('http://localhost/hide.svg');
	});

	test('hide-image-width', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover hide-image-width="10">text</x-popover>');

		const element = document.querySelector<CustomElementPopover>('x-popover');

		expect(element?.hideText).toBe('Close');
		expect(element?.hideImageWidth).toBe(10);
	});

	test('hide-image-height', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover hide-image-height="10">text</x-popover>');

		const element = document.querySelector<CustomElementPopover>('x-popover');

		expect(element?.hideText).toBe('Close');
		expect(element?.hideImageHeight).toBe(10);
	});
});

describe('slot', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('id remove', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover><span id="ID">text</span></x-popover>');

		expect(document.body.innerHTML).toBe('<x-popover><span>text</span></x-popover>');
	});
});

describe('toggle event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover>text</x-popover>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('open', () => {
		const element = document.querySelector('x-popover');
		element?.dispatchEvent(
			new CustomEvent('toggle', {
				detail: {
					newState: 'open',
				},
			}),
		);

		expect(document.body.innerHTML).toBe('<x-popover>text</x-popover>');
	});

	test('close', () => {
		const element = document.querySelector('x-popover');
		element?.dispatchEvent(
			new CustomEvent('toggle', {
				detail: {
					newState: 'closed',
				},
			}),
		);

		expect(document.body.innerHTML).toBe('<x-popover>text</x-popover>');
	});
});

describe('keydown event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<x-popover>text</x-popover>');

		document.querySelector('x-popover')?.dispatchEvent(
			new CustomEvent('toggle', {
				detail: {
					newState: 'open',
				},
			}),
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('A', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'A' }));

		expect(document.body.innerHTML).toBe('<x-popover>text</x-popover>');
	});

	test('Escape', () => {
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		expect(document.body.innerHTML).toBe('<x-popover>text</x-popover>');
	});
});
