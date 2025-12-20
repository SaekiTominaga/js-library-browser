import { expect, jest, test } from '@jest/globals';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import PreOpen from '../../attribute/PreOpen.ts';
import DetailsContentElement from '../../custom-element/DetailsContent.ts';
import clickEvent from './click.ts';

const DETAILS_CONTENT_ELEMENT_NAME = 'x-details-content';

customElements.define(DETAILS_CONTENT_ELEMENT_NAME, DetailsContentElement);

mockAnimationsApi();

Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
}); // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom

test('close → open', () => {
	const event = new MouseEvent('click');

	const detailsElement = document.createElement('details');
	const detailsContentElement = document.createElement(DETAILS_CONTENT_ELEMENT_NAME) as DetailsContentElement;
	const preOpen = new PreOpen(detailsElement);

	clickEvent(event, detailsElement, detailsContentElement, {
		preOpen: preOpen,
	});

	expect(detailsElement.open).toBeTruthy();
});

test('open → close', () => {
	const event = new MouseEvent('click');

	const detailsElement = document.createElement('details');
	const detailsContentElement = document.createElement(DETAILS_CONTENT_ELEMENT_NAME) as DetailsContentElement;
	const preOpen = new PreOpen(detailsElement);

	detailsElement.open = true;

	clickEvent(event, detailsElement, detailsContentElement, {
		preOpen: preOpen,
	});

	expect(detailsElement.open).toBeTruthy();
});
