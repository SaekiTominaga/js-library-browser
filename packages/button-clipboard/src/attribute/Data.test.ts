import { describe, afterEach, test, expect } from '@jest/globals';
import Data from './Data.ts';

describe('constructor', () => {
	test('no attribute', () => {
		expect(() => {
			new Data({ text: undefined, target: undefined });
		}).toThrow('The `data-text` or `data-target` attribute is not set.');
	});
});

describe('constructor - text attribute', () => {
	test('success', () => {
		expect(new Data({ text: 'Text', target: undefined }).text).toBe('Text');
	});
});

describe('constructor - target attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no element', () => {
		document.body.insertAdjacentHTML('beforeend', '<button data-target="xxx">Copy</button>');

		expect(() => {
			new Data({ text: undefined, target: 'xxx' });
		}).toThrow('Element `#xxx` not found.');
	});

	test('exist element', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="target">Text</p>
`,
		);

		expect(new Data({ text: undefined, target: 'target' }).element?.textContent).toBe('Text');
	});
});
