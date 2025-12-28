import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import buttonShare from './buttonShare.ts';

describe('HTML', () => {
	beforeEach(() => {
		document.body.innerHTML = `<button>Share</button>`;
	});

	test('not supprt', () => {
		// @ts-expect-error: ts(2322)
		navigator.share = undefined;

		const buttonElement = document.querySelector('button')!;

		buttonShare(buttonElement);

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
		const buttonElement = document.createElement('button');

		buttonShare(buttonElement);

		buttonElement.dispatchEvent(new Event('click'));

		expect(buttonElement.disabled).toBeFalsy();
	});
});
