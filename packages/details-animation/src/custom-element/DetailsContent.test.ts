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
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect($detailsContent.duration?.value).toBe(100);

			$detailsContent.setAttribute('duration', '200');
			expect($detailsContent.duration?.value).toBe(200);

			$detailsContent.removeAttribute('duration');
			expect($detailsContent.duration?.value).toBeUndefined();
		});

		test('set', () => {
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			$detailsContent.setAttribute('duration', '200');
			expect($detailsContent.duration?.value).toBe(200);
		});

		test('seu null', () => {
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			$detailsContent.removeAttribute('duration');
			expect($detailsContent.duration?.value).toBeUndefined();
		});
	});

	describe('easing', () => {
		beforeEach(() => {
			document.body.innerHTML = `<x-details-content easing="ease">text</x-details-content>`;
		});

		test('init', () => {
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect($detailsContent.easing?.value).toBe('ease');

			$detailsContent.setAttribute('easing', 'ease-in');
			expect($detailsContent.easing?.value).toBe('ease-in');
		});

		test('set', () => {
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			$detailsContent.setAttribute('easing', 'ease-in');
			expect($detailsContent.easing?.value).toBe('ease-in');
		});

		test('set null', () => {
			const $detailsContent = document.querySelector<DetailsContentElement>(DETAILS_CONTENT_ELEMENT_NAME)!;

			expect($detailsContent.easing?.value).toBe('ease');

			$detailsContent.removeAttribute('easing');
			expect($detailsContent.easing?.value).toBeUndefined();
		});
	});
});
