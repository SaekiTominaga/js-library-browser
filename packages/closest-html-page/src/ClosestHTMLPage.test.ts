import { describe, expect, test } from '@jest/globals';
import 'cross-fetch/polyfill';
import ClosestHTMLPage from './ClosestHTMLPage.ts';

describe('fetch', () => {
	test('<title>', async () => {
		const closestHTMLPage = new ClosestHTMLPage();

		await closestHTMLPage.fetch('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file');

		expect(closestHTMLPage.fetchedResponses.size).toBe(2);
		expect(closestHTMLPage.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');
		expect(closestHTMLPage.title).toBe('dummy');
	});

	test('OGP', async () => {
		const closestHTMLPage = new ClosestHTMLPage();

		await closestHTMLPage.fetch('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');

		expect(closestHTMLPage.fetchedResponses.size).toBe(1);
		expect(closestHTMLPage.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/');
		expect(closestHTMLPage.title).toBe('Get the data of the HTML page of the nearest ancestor hierarchy');
	});
});

describe('maxFetchCount', () => {
	test('over', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ maxFetchCount: 1 });

		await closestHTMLPage.fetch('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file');

		expect(closestHTMLPage.fetchedResponses.size).toBe(1);
		expect(closestHTMLPage.url).toBeNull();
		expect(closestHTMLPage.title).toBeNull();
	});

	test('not integer', () => {
		expect(() => {
			new ClosestHTMLPage({ maxFetchCount: 1.5 });
		}).toThrow('Argument `maxFetchCount` must be an integer.');
	});

	test('minus', () => {
		expect(() => {
			new ClosestHTMLPage({ maxFetchCount: -1 });
		}).toThrow('Argument `maxFetchCount` must be greater than or equal to 0.');
	});
});

describe('fetchOptions', () => {
	test('method: head', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ fetchOptions: { method: 'head' } });
		await closestHTMLPage.fetch('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/dir2/file');

		expect(closestHTMLPage.fetchedResponses.size).toBe(2);
		expect(closestHTMLPage.url).toBe('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');
		expect(closestHTMLPage.title).toBeNull();
	});
});

describe('mimeTypes', () => {
	test('no applicable mime type', async () => {
		const closestHTMLPage = new ClosestHTMLPage({ mimeTypes: ['image/svg+xml'] });
		await closestHTMLPage.fetch('https://saekitominaga.github.io/js-library-browser/packages/closest-html-page/demo/dir1/');

		expect(closestHTMLPage.fetchedResponses.size).toBe(5);
		expect(closestHTMLPage.url).toBeNull();
		expect(closestHTMLPage.title).toBeNull();
	});
});
