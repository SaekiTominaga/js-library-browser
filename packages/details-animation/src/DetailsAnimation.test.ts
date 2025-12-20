import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import { mockAnimationsApi } from 'jsdom-testing-mocks';
import detailsAnimation from './detailsAnimation.ts';

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

const sleep = (ms: number) =>
	new Promise((callback) => {
		setTimeout(callback, ms);
	});

test('no <summary>', () => {
	document.body.innerHTML = '<details></details>';

	expect(() => {
		detailsAnimation(document.querySelector('details')!);
	}).toThrow('Element `<details>` is missing a required instance of child element `<summary>`.');
});

describe('toggle event', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<details>
<summary>Open</summary>
<p></p>
</details>
`;

		detailsAnimation(document.querySelector('details')!);
	});

	test('load', () => {
		const detailsElement = document.querySelector('details')!;

		expect(detailsElement.dataset['preOpen']).toBe('false');
	});

	test('toggle event (open !== preopen)', () => {
		const detailsElement = document.querySelector('details')!;

		detailsElement.open = true;

		detailsElement.dispatchEvent(new UIEvent('toggle'));

		expect(detailsElement.open).toBeTruthy();
		expect(detailsElement.dataset['preOpen']).toBe('true');
	});
});

describe('close → open', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<details data-duration="100">
<summary>Open</summary>
</details>
`;

		detailsAnimation(document.querySelector('details')!);
	});

	test('summary click', () => {
		const detailsElement = document.querySelector('details')!;
		const summaryElement = detailsElement.querySelector('summary')!;

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(detailsElement.open).toBeTruthy();
		expect(detailsElement.dataset['preOpen']).toBe('true');
	});

	test('animetion end', async () => {
		const detailsElement = document.querySelector('details')!;

		await sleep(100);

		expect(detailsElement.open).toBeTruthy();
		expect(detailsElement.dataset['preOpen']).toBe('true');
	});
});

describe('open → close', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<details open="" data-duration="100">
<summary>Open</summary>
</details>
`;

		detailsAnimation(document.querySelector('details')!);
	});

	test('summary click', () => {
		const detailsElement = document.querySelector('details')!;
		const summaryElement = detailsElement.querySelector('summary')!;

		summaryElement.dispatchEvent(new UIEvent('click'));

		expect(detailsElement.open).toBeTruthy();
		expect(detailsElement.dataset['preOpen']).toBe('false');
	});

	test('animetion end', async () => {
		const detailsElement = document.querySelector('details')!;

		await sleep(100);

		expect(detailsElement.open).toBeFalsy();
		expect(detailsElement.dataset['preOpen']).toBe('false');
	});
});

/* TODO: jsdom では 0 秒アニメーションの扱いとなり、テストは通るが意味はない https://github.com/jsdom/jsdom/issues/1696 */
describe('summary click during animetion', () => {
	describe('close → open → close', () => {
		beforeAll(() => {
			document.body.innerHTML = `
<details data-duration="100">
<summary>Open</summary>
</details>
`;

			detailsAnimation(document.querySelector('details')!);
		});

		test('summary click', async () => {
			const detailsElement = document.querySelector('details')!;
			const summaryElement = detailsElement.querySelector('summary')!;

			summaryElement.dispatchEvent(new UIEvent('click'));
			await sleep(50);
			summaryElement.dispatchEvent(new UIEvent('click'));

			expect(detailsElement.open).toBeTruthy();
			expect(detailsElement.dataset['preOpen']).toBe('false');
		});

		test('animetion end', async () => {
			const detailsElement = document.querySelector('details')!;

			await sleep(100);

			expect(detailsElement.open).toBeFalsy();
			expect(detailsElement.dataset['preOpen']).toBe('false');
		});
	});

	describe('open → close → open', () => {
		beforeAll(() => {
			document.body.innerHTML = `
<details open="" data-duration="100">
<summary>Open</summary>
</details>
`;

			detailsAnimation(document.querySelector('details')!);
		});

		test('summary click', async () => {
			const detailsElement = document.querySelector('details')!;
			const summaryElement = detailsElement.querySelector('summary')!;

			summaryElement.dispatchEvent(new UIEvent('click'));
			await sleep(50);
			summaryElement.dispatchEvent(new UIEvent('click'));

			expect(detailsElement.open).toBeTruthy();
			expect(detailsElement.dataset['preOpen']).toBe('true');
		});

		test('animetion end', async () => {
			const detailsElement = document.querySelector('details')!;

			await sleep(100);

			expect(detailsElement.open).toBeTruthy();
			expect(detailsElement.dataset['preOpen']).toBe('true');
		});
	});
});
