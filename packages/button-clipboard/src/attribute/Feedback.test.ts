import { describe, afterEach, test, expect } from '@jest/globals';
import Feedback from './Feedback.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(new Feedback(undefined).element).toBeUndefined();
	});

	test('no element', () => {
		expect(() => {
			new Feedback('xxx');
		}).toThrow('Element `#xxx` not found.');
	});

	test('exist element', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="feedback">Text</p>
`,
		);

		expect(new Feedback('feedback').element?.textContent).toBe('Text');
	});
});
