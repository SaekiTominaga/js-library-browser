import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { SpiedFunction } from 'jest-mock';
import reportJsError, { type FetchOption, type Option } from './reportJsError.ts';

const fetchOptions: Readonly<FetchOption> = {
	endpoint: new URL('https://report.w0s.jp/report/js-sample'),
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

let eventSpy: SpiedFunction;

beforeEach(() => {
	eventSpy = jest.spyOn(globalThis, 'addEventListener');
});

afterEach(() => {
	eventSpy.mockRestore();
});

test('正常ケース', () => {
	reportJsError(options);

	expect(eventSpy).toHaveBeenCalledWith('error', expect.any(Function), { passive: true });
});

describe('validate', () => {
	describe('ua', () => {
		test('denys', () => {
			reportJsError({
				fetch: fetchOptions,
				validate: {
					ua: { denys: [/ jsdom\//v] },
				},
			});

			expect(eventSpy).not.toHaveBeenCalled();
		});

		test('allows', () => {
			reportJsError({
				fetch: fetchOptions,
				validate: {
					ua: { allows: [/foo/v] },
				},
			});

			expect(eventSpy).not.toHaveBeenCalled();
		});
	});
});
