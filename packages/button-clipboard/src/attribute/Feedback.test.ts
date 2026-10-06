import { expect, test } from '@jest/globals';
import Feedback from './Feedback.ts';

test('no attribute', () => {
	const feedback = new Feedback({});

	expect(feedback.text).toBeUndefined();
	expect(feedback.$element).toBeUndefined();
});

test('no element', () => {
	expect(() => {
		new Feedback({ element: 'xxx', text: 'Text' });
	}).toThrow(new Error('Element `#xxx` not found'));
});

test('element typed mismatch', () => {
	document.body.innerHTML = `<p id="feedback"></p>`;

	expect(() => {
		new Feedback({ element: 'feedback', text: 'Text' });
	}).toThrow(new TypeError('Element `#feedback` must be a `HTMLOutputElement`'));
});

test('exist element', () => {
	document.body.innerHTML = `<output id="feedback"></output>`;

	const feedback = new Feedback({ element: 'feedback', text: 'Text', duration: '100ms' });

	expect(feedback.$element?.tagName).toBe('OUTPUT');
	expect(feedback.$element?.role).toBe('status');
	expect(feedback.text).toBe('Text');
	expect(feedback.duration).toBe(100);
});
