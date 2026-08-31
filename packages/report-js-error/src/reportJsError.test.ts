import { describe, expect, jest, test } from '@jest/globals';
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

const eventSpy = jest.spyOn(globalThis, 'addEventListener');

test('正常ケース', () => {
	reportJsError(options);

	eventSpy.mockRestore();

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

			eventSpy.mockRestore();

			expect(eventSpy).not.toHaveBeenCalled();
		});

		test('allows', () => {
			reportJsError({
				fetch: fetchOptions,
				validate: {
					ua: { allows: [/foo/v] },
				},
			});

			eventSpy.mockRestore();

			expect(eventSpy).not.toHaveBeenCalled();
		});
	});
});
