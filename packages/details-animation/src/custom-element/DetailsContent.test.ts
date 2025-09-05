import { describe, beforeAll, afterAll, afterEach, test, expect } from '@jest/globals';
import CustomElementDetailsContent from './DetailsContent.ts';

customElements.define('x-details-content', CustomElementDetailsContent);

describe('connected', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content>text</x-details-content>');
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('connected', () => {
		expect(document.body.innerHTML).toBe('<x-details-content>text</x-details-content>');
	});
});

describe('attributeChanged', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('duration', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content duration="100">text</x-details-content>');
		const element = document.querySelector<CustomElementDetailsContent>('x-details-content');

		expect(element?.duration?.value).toBe(100);

		element?.setAttribute('duration', '200');
		expect(element?.duration?.value).toBe(200);

		element?.removeAttribute('duration');
		expect(element?.duration?.value).toBeUndefined();
	});

	test('easing', () => {
		document.body.insertAdjacentHTML('beforeend', '<x-details-content easing="ease">text</x-details-content>');
		const element = document.querySelector<CustomElementDetailsContent>('x-details-content');

		expect(element?.easing?.value).toBe('ease');

		element?.setAttribute('easing', 'ease-in');
		expect(element?.easing?.value).toBe('ease-in');

		element?.removeAttribute('easing');
		expect(element?.easing?.value).toBeUndefined();
	});
});
