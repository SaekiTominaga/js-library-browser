import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import buttonShare from './buttonShare.ts';

describe('HTML', () => {
	beforeEach(() => {
		document.body.innerHTML = `<button>Share</button>`;
	});

	test('not supprt', () => {
		// @ts-expect-error: ts(2322)
		navigator.share = undefined;

		const $button = document.querySelector('button')!;

		buttonShare($button);

		expect(document.body.innerHTML).toBe(`<button disabled="">Share</button>`);
	});
});

describe('event', () => {
	beforeAll(() => {
		navigator.share = async (): Promise<void> => {
			/**/
		};
	});

	test('click', () => {
		const $button = document.createElement('button');

		buttonShare($button);

		$button.dispatchEvent(new Event('click'));

		expect($button.disabled).toBeFalsy();
	});
});
