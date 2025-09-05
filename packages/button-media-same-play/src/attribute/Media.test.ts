import { describe, afterEach, test, expect } from '@jest/globals';
import Media from './Media.ts';

describe('constructor', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('no attribute', () => {
		expect(() => {
			new Media(undefined);
		}).toThrow('The `aria-controls` attribute is not set.');
	});

	test('no element', () => {
		expect(() => {
			new Media('xxx');
		}).toThrow('Element `#xxx` not found.');
	});

	test('not media', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<p id="video1"></p>
`,
		);

		expect(() => {
			new Media('video1');
		}).toThrow('Element `#video1` is not a `HTMLMediaElement`.');
	});

	test('exist media', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<video id="video1"></video>
<video id="video2"></video>
`,
		);

		const medias = new Media('video1 video2').elements;

		expect(medias.length).toBe(2);
		expect(medias.at(0)?.id).toBe('video1');
		expect(medias.at(1)?.id).toBe('video2');
	});
});
