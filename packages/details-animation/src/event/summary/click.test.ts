import { beforeAll, expect, jest, test } from '@jest/globals';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import PreOpen from '../../attribute/PreOpen.ts';
import DetailsContentElement from '../../custom-element/DetailsContent.ts';
import clickEvent from './click.ts';

const DETAILS_CONTENT_ELEMENT_NAME = 'x-details-content';

beforeAll(() => {
	customElements.define(DETAILS_CONTENT_ELEMENT_NAME, DetailsContentElement);

	mockAnimationsApi();

	Object.defineProperty(globalThis, 'matchMedia', {
		value: jest.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			dispatchEvent: jest.fn(),
		})),
	}); // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
});

test('close → open', () => {
	const event = new MouseEvent('click');

	const $details = document.createElement('details');
	const $detailsContent = document.createElement(DETAILS_CONTENT_ELEMENT_NAME) as DetailsContentElement;
	const preOpen = new PreOpen($details);

	clickEvent(event, {
		detailsElement: $details,
		detailsContentElement: $detailsContent,
		preOpen: preOpen,
	});

	expect($details.open).toBeTruthy();
});

test('open → close', () => {
	const event = new MouseEvent('click');

	const $details = document.createElement('details');
	const $detailsContent = document.createElement(DETAILS_CONTENT_ELEMENT_NAME) as DetailsContentElement;
	const preOpen = new PreOpen($details);

	$details.open = true;

	clickEvent(event, {
		detailsElement: $details,
		detailsContentElement: $detailsContent,
		preOpen: preOpen,
	});

	expect($details.open).toBeTruthy();
});
