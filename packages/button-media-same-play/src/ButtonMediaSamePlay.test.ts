import { describe, afterEach, test } from '@jest/globals';
import ButtonMediaSamePlay from './ButtonMediaSamePlay.ts';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('all attribute', () => {
		document.body.insertAdjacentHTML(
			'beforeend',
			`
<button aria-controls="video1 video2">Simultaneous playback</button>
<video id="video1"></video>
<video id="video2"></video>
`,
		);

		const element = document.querySelector('button')!;

		new ButtonMediaSamePlay(element);

		/* TODO: element.dispatchEvent(new Event('click')); */
	});
});
