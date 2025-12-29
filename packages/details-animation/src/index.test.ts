import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import index from './index.ts';

describe('browser support adoptedStyleSheets', () => {
	let tempAdoptedStyleSheets: CSSStyleSheet[];

	beforeAll(() => {
		tempAdoptedStyleSheets = ShadowRoot.prototype.adoptedStyleSheets;
		// @ts-expect-error: ts(2790)
		delete ShadowRoot.prototype.adoptedStyleSheets;
	});
	afterAll(() => {
		ShadowRoot.prototype.adoptedStyleSheets = tempAdoptedStyleSheets;
	});

	test('not support', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		index(null);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support ShadowRoot: `adoptedStyleSheets`.');

		consoleInfoSpy.mockRestore();
	});
});

describe('argument type', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<details id="details" class="details">
<summary>Open</summary>
<p></p>
</details>
`;
	});

	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('details'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('details'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('details'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#details'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.details'));
		}).not.toThrow();
	});

	test('null', () => {
		expect(() => {
			index(document.querySelector('.foo'));
		}).not.toThrow();
	});
});

test('type mismatch', () => {
	expect(() => {
		index(document.createElement('p'));
	}).toThrow('Element must be a `HTMLDetailsElement`');
});
