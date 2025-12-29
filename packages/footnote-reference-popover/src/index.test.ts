import { afterAll, beforeAll, describe, expect, jest, test } from '@jest/globals';
import index from './index.ts';

describe('blowser support popover', () => {
	let tempShowPopover: () => void;

	beforeAll(() => {
		tempShowPopover = HTMLElement.prototype.showPopover.bind(HTMLElement);
		// @ts-expect-error: ts(2790)
		delete HTMLElement.prototype.showPopover;
	});
	afterAll(() => {
		HTMLElement.prototype.showPopover = tempShowPopover;
	});

	test('not support', () => {
		const consoleInfoSpy = jest.spyOn(console, 'info');

		index(null);

		expect(consoleInfoSpy).toHaveBeenCalledWith('This browser does not support popover');

		consoleInfoSpy.mockRestore();
	});
});

describe('argument type', () => {
	beforeAll(() => {
		document.body.innerHTML = `
<a href="#footnote" class="footnote-reference-popover" id="footnote-reference-popover"></a>
<p id="footnote"></p>
`;
	});

	test('getElementById', () => {
		expect(() => {
			index(document.getElementById('footnote-reference-popover'));
		}).not.toThrow();
	});

	test('getElementsByClassName', () => {
		expect(() => {
			index(document.getElementsByClassName('footnote-reference-popover'));
		}).not.toThrow();
	});

	test('getElementsByTagName', () => {
		expect(() => {
			index(document.getElementsByTagName('a'));
		}).not.toThrow();
	});

	test('querySelector', () => {
		expect(() => {
			index(document.querySelector('#footnote-reference-popover'));
		}).not.toThrow();
	});

	test('querySelectorAll', () => {
		expect(() => {
			index(document.querySelectorAll('.footnote-reference-popover'));
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
	}).toThrow('Element must be a `HTMLAnchorElement`');
});
