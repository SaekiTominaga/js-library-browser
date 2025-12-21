import { expect, test } from '@jest/globals';
import Controles from './Controles.ts';

test('no attribute', () => {
	expect(() => {
		new Controles(undefined);
	}).toThrow('The `aria-controls` attribute is not set.');
});

test('no element', () => {
	expect(() => {
		new Controles('xxx');
	}).toThrow('Element `#xxx` not found.');
});

test('not media element', () => {
	document.body.innerHTML = `<p id="video1"></p>`;

	expect(() => {
		new Controles('video1');
	}).toThrow('Element `#video1` is not a `HTMLMediaElement`.');
});

test('exist media', () => {
	document.body.innerHTML = `
<video id="video1"></video>
<video id="video2"></video>
`;

	const mediaElements = new Controles('video1 video2').elements;

	expect(mediaElements.length).toBe(2);
	expect(mediaElements.at(0)?.id).toBe('video1');
	expect(mediaElements.at(1)?.id).toBe('video2');
});
