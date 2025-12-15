import { describe, expect, test } from '@jest/globals';
// eslint-disable-next-line import/no-unassigned-import
import 'cross-fetch/polyfill';
import closestHTMLPage from './closestHTMLPage.ts';

describe('fetch', () => {
	test('<title>', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file',
		);

		expect(fetchedResponses.length).toBe(2);
		expect(closestHTMLPageData?.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');
		expect(closestHTMLPageData?.title).toBe('dummy');
	});

	test('OGP', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/',
		);

		expect(fetchedResponses.length).toBe(1);
		expect(closestHTMLPageData?.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/');
		expect(closestHTMLPageData?.title).toBe('Get the data of the HTML page of the nearest ancestor hierarchy');
	});
});

describe('maxFetchCount', () => {
	test('over', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file',
			{ maxFetchCount: 1 },
		);

		expect(fetchedResponses.length).toBe(1);
		expect(closestHTMLPageData?.url).toBeUndefined();
		expect(closestHTMLPageData?.title).toBeUndefined();
	});

	test('not integer', async () => {
		await expect(closestHTMLPage('http://example.com', { maxFetchCount: 1.5 })).rejects.toThrow('Argument `maxFetchCount` must be an integer.');
	});

	test('minus', async () => {
		await expect(closestHTMLPage('http://example.com', { maxFetchCount: -1 })).rejects.toThrow('Argument `maxFetchCount` must be greater than or equal to 0.');
	});
});

describe('fetchOptions', () => {
	test('method: head', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file',
			{ fetchOptions: { method: 'head' } },
		);

		expect(fetchedResponses.length).toBe(2);
		expect(closestHTMLPageData?.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');
		expect(closestHTMLPageData?.title).toBeUndefined();
	});
});

describe('mimeTypes', () => {
	test('no applicable mime type', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/',
			{ mimeTypes: ['image/svg+xml'] },
		);

		expect(fetchedResponses.length).toBe(5);
		expect(closestHTMLPageData?.url).toBeUndefined();
		expect(closestHTMLPageData?.title).toBeUndefined();
	});
});
