import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import formBeforeUnloadConfirm from './formBeforeUnloadConfirm.ts';

describe('event', () => {
	beforeEach(() => {
		document.body.innerHTML = `<form><input></form>`;

		formBeforeUnloadConfirm(document.querySelector('form')!);
	});

	test('beforeunload', () => {
		const beforeunloadEvent = new Event('beforeunload');
		const preventDefaultSpy = jest.spyOn(beforeunloadEvent, 'preventDefault');

		window.dispatchEvent(beforeunloadEvent);
		window.dispatchEvent(new Event('unload'));

		expect(preventDefaultSpy).not.toHaveBeenCalled();

		preventDefaultSpy.mockRestore();
	});

	test('submit & beforeunload', () => {
		const beforeunloadEvent = new Event('beforeunload');
		const preventDefaultSpy = jest.spyOn(beforeunloadEvent, 'preventDefault');

		document.querySelector('form')?.dispatchEvent(new Event('submit'));
		window.dispatchEvent(beforeunloadEvent);
		window.dispatchEvent(new Event('unload'));

		expect(preventDefaultSpy).not.toHaveBeenCalled();

		preventDefaultSpy.mockRestore();
	});

	test('change → beforeunload', () => {
		const beforeunloadEvent = new Event('beforeunload');
		const preventDefaultSpy = jest.spyOn(beforeunloadEvent, 'preventDefault');

		document.querySelector('input')?.dispatchEvent(new Event('change'));
		window.dispatchEvent(beforeunloadEvent);
		window.dispatchEvent(new Event('unload'));

		expect(preventDefaultSpy).toHaveBeenCalled();

		preventDefaultSpy.mockRestore();
	});

	test('change → submit & beforeunload', () => {
		const beforeunloadEvent = new Event('beforeunload');
		const preventDefaultSpy = jest.spyOn(beforeunloadEvent, 'preventDefault');

		document.querySelector('input')?.dispatchEvent(new Event('change'));
		document.querySelector('form')?.dispatchEvent(new Event('submit'));
		window.dispatchEvent(beforeunloadEvent);
		window.dispatchEvent(new Event('unload'));

		expect(preventDefaultSpy).not.toHaveBeenCalled();

		preventDefaultSpy.mockRestore();
	});
});
