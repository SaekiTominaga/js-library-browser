import { describe, expect, test } from '@jest/globals';
// eslint-disable-next-line import/no-unassigned-import
import 'cross-fetch/polyfill';
import { fetchOptions, options } from '../reportJsError.test.ts';
import errorEvent from './error.ts';

const errorEventInit: Readonly<ErrorEventInit> = {
	message: 'test',
	filename: 'http://example.com/foo.js',
	lineno: 1,
	colno: 2,
};

const testTimeout = 10000; // default=5000 <https://jestjs.io/docs/api#testname-fn-timeout>

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

		const fetchOptionsTemp = { ...options.fetch };
		fetchOptionsTemp.contentType = 'application/x-www-form-urlencoded';

		await expect(
			errorEvent(event, {
				fetch: fetchOptionsTemp,
				validate: { ...options.validate },
			}),
		).rejects.toThrow('`https://report.w0s.jp/report/js-sample` is 400 Bad Request'); // TODO: データ形式の正当性が確認できていない
	},
	testTimeout,
);

test(
	'fetch error',
	async () => {
		const event = new ErrorEvent('error', errorEventInit);

		const fetchOptionsTemp = { ...options.fetch };
		fetchOptionsTemp.endpoint = new URL('https://saekitominaga.github.io/js-library-browser/packages/report-js-error/');

		await expect(
			errorEvent(event, {
				fetch: fetchOptionsTemp,
				validate: { ...options.validate },
			}),
		).rejects.toThrow('`https://saekitominaga.github.io/js-library-browser/packages/report-js-error/` is 405 Method Not Allowed');
	},
	testTimeout,
);

describe('validate', () => {
	describe('filename', () => {
		test(
			'YJApp-ANDROID',
			async () => {
				const errorEventInitTemp = { ...errorEventInit };
				errorEventInitTemp.filename = '';

				const event = new ErrorEvent('error', errorEventInitTemp);

				expect(await errorEvent(event, options)).toBeUndefined();
			},
			testTimeout,
		);

		describe('protocol', () => {
			test(
				'invalid',
				async () => {
					const errorEventInitTemp = { ...errorEventInit };
					errorEventInitTemp.filename = 'ftp://example.com/foo.js';

					const event = new ErrorEvent('error', errorEventInitTemp);

					expect(await errorEvent(event, options)).toBeUndefined();
				},
				testTimeout,
			);

			test(
				'https',
				async () => {
					const errorEventInitTemp = { ...errorEventInit };
					errorEventInitTemp.filename = 'https://example.com/foo.js';

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

				expect(
					await errorEvent(event, {
						fetch: fetchOptions,
						validate: {
							filename: {
								denys: [/\/foo.js$/v],
							},
						},
					}),
				).toBeUndefined();
			},
			testTimeout,
		);

		test(
			'allows',
			async () => {
				const event = new ErrorEvent('error', errorEventInit);

				expect(
					await errorEvent(event, {
						fetch: fetchOptions,
						validate: {
							filename: {
								allows: [/\/bar.js$/v],
							},
						},
					}),
				).toBeUndefined();
			},
			testTimeout,
		);
	});
});
