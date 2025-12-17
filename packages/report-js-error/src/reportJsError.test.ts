import { describe, expect, jest, test } from '@jest/globals';
import reportJsError, { type FetchOption, type Option } from './reportJsError.ts';

export const fetchOptions: Readonly<FetchOption> = {
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
export const options: Readonly<Option> = {
	fetch: fetchOptions,
};

const eventSpy = jest.spyOn(window, 'addEventListener');

test('正常ケース', () => {
	reportJsError(options);

	expect(eventSpy).toHaveBeenCalledWith('error', expect.any(Function), { passive: true });

	eventSpy.mockRestore();
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

			expect(eventSpy).toHaveBeenCalledTimes(0);

			eventSpy.mockRestore();
		});

		test('allows', () => {
			reportJsError({
				fetch: fetchOptions,
				validate: {
					ua: { allows: [/foo/v] },
				},
			});

			expect(eventSpy).toHaveBeenCalledTimes(0);

			eventSpy.mockRestore();
		});
	});
});
