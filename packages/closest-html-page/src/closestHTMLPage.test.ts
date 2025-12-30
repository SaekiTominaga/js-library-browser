import { describe, expect, test } from '@jest/globals';
// eslint-disable-next-line import/no-unassigned-import
import 'cross-fetch/polyfill';
import closestHTMLPage, { fetchProcess } from './closestHTMLPage.ts';

describe('validate', () => {
	describe('maxFetchCount', () => {
		test('not integer', async () => {
			await expect(closestHTMLPage('http://example.com', { maxFetchCount: 1.5 })).rejects.toThrow('Argument `maxFetchCount` must be an integer.');
		});

		test('minus', async () => {
			await expect(closestHTMLPage('http://example.com', { maxFetchCount: -1 })).rejects.toThrow(
				'Argument `maxFetchCount` must be greater than or equal to 0.',
			);
		});
	});
});

describe('closestHTMLPage', () => {
	test('正常系', async () => {
		const { fetchedResponses, closestHTMLPageData } = await closestHTMLPage(
			'https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file',
		);

		expect(fetchedResponses.length).toBe(2);
		expect(closestHTMLPageData?.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');
		expect(closestHTMLPageData?.title).toBe('dummy');
	});

	test('maxFetchCount', async () => {
		const { fetchedResponses } = await closestHTMLPage('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file', {
			maxFetchCount: 1,
		});

		expect(fetchedResponses.length).toBe(1);
	});
});

describe('fetchProcess', () => {
	test('OGP', async () => {
		const { response, htmlPage, title } = await fetchProcess(new URL('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/'));

		expect(response.ok).toBeTruthy();
		expect(htmlPage).toBeTruthy();
		expect(title).toBe('Get the data of the HTML page of the nearest ancestor hierarchy');
	});

	test('<title>', async () => {
		const { response, htmlPage, title } = await fetchProcess(
			new URL('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/'),
		);

		expect(response.ok).toBeTruthy();
		expect(htmlPage).toBeTruthy();
		expect(title).toBe('dummy');
	});

	test('404', async () => {
		const { response, htmlPage, title } = await fetchProcess(new URL('https://saekitominaga.github.io/js-library-browser/foo'));

		expect(response.ok).toBeFalsy();
		expect(htmlPage).toBeUndefined();
		expect(title).toBeUndefined();
	});

	test('no matched mime type', async () => {
		const { response, htmlPage, title } = await fetchProcess(
			new URL('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/'),
			{
				mimeTypes: ['application/xhtml+xml'],
			},
		);

		expect(response.ok).toBeTruthy();
		expect(htmlPage).toBeFalsy();
		expect(title).toBeUndefined();
	});

	test('method: head', async () => {
		const { response, htmlPage, title } = await fetchProcess(
			new URL('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/'),
			{
				fetchOptions: { method: 'head' },
			},
		);

		expect(response.ok).toBeTruthy();
		expect(htmlPage).toBeTruthy();
		expect(title).toBeUndefined();
	});
});
