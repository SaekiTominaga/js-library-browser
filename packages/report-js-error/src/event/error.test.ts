import { describe, expect, test } from '@jest/globals';
// oxlint-disable-next-line import/no-unassigned-import
import 'cross-fetch/polyfill';
import type { FetchOption, Option } from '../reportJsError.ts';
import errorEvent from './error.ts';

const errorEventInit: Readonly<ErrorEventInit> = {
	message: 'test',
	filename: 'http://example.com/foo.js',
	lineno: 1,
	colno: 2,
};

const testTimeout = 10_000; // default=5000 <https://jestjs.io/docs/api#testname-fn-timeout>

const fetchOptions: Readonly<FetchOption> = {
	endpoint: new URL('https://api.w0s.jp/report/js-sample'),
	param: {
		documentURL: 'documentURL',
		message: 'message',
		filename: 'jsURL',
		lineno: 'lineNumber',
		colno: 'columnNumber',
	},
	contentType: 'application/json',
	headers: {
		origin: 'https://saekitominaga.github.io',
	},
};

const options: Readonly<Option> = {
	fetch: fetchOptions,
};

test(
	'正常ケース',
	async () => {
		const event = new ErrorEvent('error', errorEventInit);

		expect((await errorEvent(event, options))?.status).toBe(204);
	},
	testTimeout,
);

test(
	'application/x-www-form-urlencoded',
	async () => {
		const event = new ErrorEvent('error', errorEventInit);

		const fetchOptionsTemp: FetchOption = {
			...options.fetch,
			contentType: 'application/x-www-form-urlencoded',
		};

		await expect(
			errorEvent(event, {
				fetch: fetchOptionsTemp,
				validate: { ...options.validate },
			}),
		).rejects.toThrow(new Error('`https://api.w0s.jp/report/js-sample` is 400 Bad Request')); // TODO: データ形式の正当性が確認できていない
	},
	testTimeout,
);

test(
	'fetch error',
	async () => {
		const event = new ErrorEvent('error', errorEventInit);

		const fetchOptionsTemp: FetchOption = {
			...options.fetch,
			endpoint: new URL('https://saekitominaga.github.io/js-library-browser/packages/report-js-error/'),
		};

		await expect(
			errorEvent(event, {
				fetch: fetchOptionsTemp,
				validate: { ...options.validate },
			}),
		).rejects.toThrow(new Error('`https://saekitominaga.github.io/js-library-browser/packages/report-js-error/` is 405 Method Not Allowed'));
	},
	testTimeout,
);

describe('validate', () => {
	describe('filename', () => {
		test(
			'YJApp-ANDROID',
			async () => {
				const errorEventInitTemp: ErrorEventInit = {
					...errorEventInit,
					filename: '',
				};

				const event = new ErrorEvent('error', errorEventInitTemp);

				await expect(errorEvent(event, options)).resolves.toBeUndefined();
			},
			testTimeout,
		);

		describe('protocol', () => {
			test(
				'invalid',
				async () => {
					const errorEventInitTemp: ErrorEventInit = {
						...errorEventInit,
						filename: 'ftp://example.com/foo.js',
					};

					const event = new ErrorEvent('error', errorEventInitTemp);

					await expect(errorEvent(event, options)).resolves.toBeUndefined();
				},
				testTimeout,
			);

			test(
				'https',
				async () => {
					const errorEventInitTemp: ErrorEventInit = {
						...errorEventInit,
						filename: 'https://example.com/foo.js',
					};

					const event = new ErrorEvent('error', errorEventInitTemp);

					expect((await errorEvent(event, options))?.status).toBe(204);
				},
				testTimeout,
			);
		});

		test(
			'denys',
			async () => {
				const event = new ErrorEvent('error', errorEventInit);

				await expect(
					errorEvent(event, {
						fetch: fetchOptions,
						validate: {
							filename: {
								denys: [/\/foo.js$/v],
							},
						},
					}),
				).resolves.toBeUndefined();
			},
			testTimeout,
		);

		test(
			'allows',
			async () => {
				const event = new ErrorEvent('error', errorEventInit);

				await expect(
					errorEvent(event, {
						fetch: fetchOptions,
						validate: {
							filename: {
								allows: [/\/bar.js$/v],
							},
						},
					}),
				).resolves.toBeUndefined();
			},
			testTimeout,
		);
	});
});
