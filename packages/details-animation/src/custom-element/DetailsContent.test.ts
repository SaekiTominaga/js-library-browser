import { beforeEach, describe, expect, test } from '@jest/globals';
import DetailsContentElement from './DetailsContent.ts';

const DETAILS_CONTENT_ELEMENT_NAME = 'x-details-content';

customElements.define(DETAILS_CONTENT_ELEMENT_NAME, DetailsContentElement);

describe('attributes', () => {
	describe('duration', () => {
		beforeEach(() => {
			document.body.innerHTML = `<x-details-content duration="100">text</x-details-content>`;
		});

		test('init', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect(detailsContentElement.duration?.value).toBe(100);

			detailsContentElement.setAttribute('duration', '200');
			expect(detailsContentElement.duration?.value).toBe(200);

			detailsContentElement.removeAttribute('duration');
			expect(detailsContentElement.duration?.value).toBeUndefined();
		});

		test('set', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			detailsContentElement.setAttribute('duration', '200');
			expect(detailsContentElement.duration?.value).toBe(200);
		});

		test('seu null', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			detailsContentElement.removeAttribute('duration');
			expect(detailsContentElement.duration?.value).toBeUndefined();
		});
	});

	describe('easing', () => {
		beforeEach(() => {
			document.body.innerHTML = `<x-details-content easing="ease">text</x-details-content>`;
		});

		test('init', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect(detailsContentElement.easing?.value).toBe('ease');

			detailsContentElement.setAttribute('easing', 'ease-in');
			expect(detailsContentElement.easing?.value).toBe('ease-in');
		});

		test('set', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			detailsContentElement.setAttribute('easing', 'ease-in');
			expect(detailsContentElement.easing?.value).toBe('ease-in');
		});

		test('set null', () => {
			const detailsContentElement = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect(detailsContentElement.easing?.value).toBe('ease');

			detailsContentElement.removeAttribute('easing');
			expect(detailsContentElement.easing?.value).toBeUndefined();
		});
	});
});
