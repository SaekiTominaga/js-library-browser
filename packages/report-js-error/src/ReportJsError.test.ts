import { test, expect, jest } from '@jest/globals';
import ReportJsError from './ReportJsError.ts';

test('正常ケース', () => {
	new ReportJsError('/endpoint', {
		fetchParam: {
			documentURL: 'xxx',
			message: 'xxx',
			filename: 'xxx',
			lineno: 'xxx',
			colno: 'xxx',
		},
	});
});

test('denyUAs に引っかかる', () => {
	const spyConsole = jest.spyOn(console, 'info');

	new ReportJsError('/endpoint', {
		fetchParam: {
			documentURL: 'xxx',
			message: 'xxx',
			filename: 'xxx',
			lineno: 'xxx',
			colno: 'xxx',
		},
		denyUAs: [/ jsdom\//u],
	});

	expect(spyConsole).toHaveBeenCalled();

	spyConsole.mockRestore();
});

test('allowUAs に引っかからない', () => {
	const spyConsole = jest.spyOn(console, 'info');

	new ReportJsError('/endpoint', {
		fetchParam: {
			documentURL: 'xxx',
			message: 'xxx',
			filename: 'xxx',
			lineno: 'xxx',
			colno: 'xxx',
		},
		allowUAs: [/foo/u],
	});

	expect(spyConsole).toHaveBeenCalled();

	spyConsole.mockRestore();
});
