import { beforeEach, describe, expect, test } from '@jest/globals';
// oxlint-disable-next-line import/no-unassigned-import
import 'cross-fetch/polyfill';
import reportSameReferrer, { type FetchOption } from './reportSameReferrer.ts';

const fetchOptions: Readonly<FetchOption> = {
	endpoint: new URL('https://report.w0s.jp/report/referrer-sample'),
	param: {
		documentURL: 'documentURL',
		referrer: 'referrer',
	},
	contentType: 'application/json',
	headers: {
		origin: 'https://saekitominaga.github.io',
	},
};

beforeEach(() => {
	Object.defineProperty(document, 'referrer', { value: 'http://localhost/', configurable: true });
});

test('正常ケース', async () => {
	expect(
		(
			await reportSameReferrer({
				fetch: fetchOptions,
			})
		)?.status,
	).toBe(204);
});

test('application/x-www-form-urlencoded', async () => {
	const fetchOptionsTemp: FetchOption = {
		...fetchOptions,
		contentType: 'application/x-www-form-urlencoded',
	};

	await expect(
		reportSameReferrer({
			fetch: fetchOptionsTemp,
		}),
	).rejects.toThrow(new Error('`https://report.w0s.jp/report/referrer-sample` is 400 Bad Request')); // TODO: データ形式の正当性が確認できていない
});

describe('validate', () => {
	describe('referrer', () => {
		test('no referrer', async () => {
			Object.defineProperty(document, 'referrer', { value: '' });

			await expect(
				reportSameReferrer({
					fetch: fetchOptions,
				}),
			).resolves.toBeUndefined();
		});

		describe('sames', () => {
			test('referrer match', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://example.com/' });

				expect(
					(
						await reportSameReferrer({
							fetch: fetchOptions,
							validate: {
								referrer: {
									sames: ['http://example.com'],
								},
							},
						})
					)?.status,
				).toBe(204);
			});

			test('location match', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://localhost/' });

				expect(
					(
						await reportSameReferrer({
							fetch: fetchOptions,
							validate: {
								referrer: {
									sames: ['http://example.net'],
								},
							},
						})
					)?.status,
				).toBe(204);
			});

			test('unmatch', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://example.com/' });

				await expect(
					reportSameReferrer({
						fetch: fetchOptions,
						validate: {
							referrer: {
								sames: ['http://example.net'],
							},
						},
					}),
				).resolves.toBeUndefined();
			});
		});

		describe('comparePart', () => {
			test('origin', async () => {
				Object.defineProperty(document, 'referrer', { value: 'https://localhost/' });

				await expect(
					reportSameReferrer({
						fetch: fetchOptions,
						validate: {
							referrer: {
								comparePart: 'origin', // http://localhost !== https://localhost
							},
						},
					}),
				).resolves.toBeUndefined();
			});

			test('host', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://localhost:999/' });

				await expect(
					reportSameReferrer({
						fetch: fetchOptions,
						validate: {
							referrer: {
								comparePart: 'host', // localhost !== localhost:999
							},
						},
					}),
				).resolves.toBeUndefined();
			});

			test('hostname', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://example.com/' });

				await expect(
					reportSameReferrer({
						fetch: fetchOptions,
						validate: {
							referrer: {
								comparePart: 'hostname', // localhost !== example.com
							},
						},
					}),
				).resolves.toBeUndefined();
			});

			test('invalid', async () => {
				Object.defineProperty(document, 'referrer', { value: 'http://example.com/' });

				await expect(
					reportSameReferrer({
						fetch: fetchOptions,
						validate: {
							referrer: {
								// @ts-expect-error: ts(2322)
								comparePart: 'foo',
							},
						},
					}),
				).rejects.toThrow(new Error('An invalid value was specified for the argument `condition`'));
			});
		});
	});

	describe('user agent', () => {
		test('denys', async () => {
			await expect(
				reportSameReferrer({
					fetch: fetchOptions,
					validate: {
						ua: { denys: [/ jsdom\//v] },
					},
				}),
			).resolves.toBeUndefined();
		});

		test('allows', async () => {
			await expect(
				reportSameReferrer({
					fetch: fetchOptions,
					validate: {
						ua: { allows: [/foo/v] },
					},
				}),
			).resolves.toBeUndefined();
		});
	});
});
