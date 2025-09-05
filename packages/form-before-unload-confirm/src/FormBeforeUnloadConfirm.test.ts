import { describe, beforeAll, afterAll, test, expect, jest } from '@jest/globals';
import FormBeforeUnloadConfirm from './FormBeforeUnloadConfirm.ts';

describe('event', () => {
	beforeAll(() => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<form><input></form>
`,
		);
	});
	afterAll(() => {
		document.body.innerHTML = '';
	});

	test('beforeunload', () => {
		const element = document.querySelector('form')!;
		new FormBeforeUnloadConfirm(element);

		const beforeunload = new Event('beforeunload');
		const spy = jest.spyOn(beforeunload, 'preventDefault');

		window.dispatchEvent(beforeunload);

		expect(spy).not.toHaveBeenCalled();

		spy.mockRestore();
	});

	test('submit & beforeunload', () => {
		const element = document.querySelector('form')!;
		new FormBeforeUnloadConfirm(element);

		const beforeunload = new Event('beforeunload');
		const spy = jest.spyOn(beforeunload, 'preventDefault');

		element.dispatchEvent(new Event('submit'));
		window.dispatchEvent(beforeunload);

		expect(spy).not.toHaveBeenCalled();

		spy.mockRestore();
	});

	test('change & beforeunload', () => {
		const element = document.querySelector('form')!;
		new FormBeforeUnloadConfirm(element);

		const beforeunload = new Event('beforeunload');
		const spy = jest.spyOn(beforeunload, 'preventDefault');

		document.querySelector('input')?.dispatchEvent(new Event('change'));
		window.dispatchEvent(beforeunload);

		expect(spy).toHaveBeenCalled();

		spy.mockRestore();
	});

	test('change & submit & beforeunload', () => {
		const element = document.querySelector('form')!;
		new FormBeforeUnloadConfirm(element);

		const beforeunload = new Event('beforeunload');
		const spy = jest.spyOn(beforeunload, 'preventDefault');

		document.querySelector('input')?.dispatchEvent(new Event('change'));
		element.dispatchEvent(new Event('submit'));
		window.dispatchEvent(beforeunload);

		expect(spy).not.toHaveBeenCalled();

		spy.mockRestore();
	});
});
