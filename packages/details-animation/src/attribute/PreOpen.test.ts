import { expect, test } from '@jest/globals';
import PreOpen from './PreOpen.ts';

test('state property', () => {
	const preOpen = new PreOpen(document.createElement('details'));

	expect(preOpen.state).toBeFalsy();

	preOpen.state = true;
	expect(preOpen.state).toBeTruthy();

	preOpen.state = false;
	expect(preOpen.state).toBeFalsy();
});

test('toggle() method', () => {
	const preOpen = new PreOpen(document.createElement('details'));

	expect(preOpen.toggle()).toBeTruthy();
	expect(preOpen.toggle()).toBeFalsy();
});
