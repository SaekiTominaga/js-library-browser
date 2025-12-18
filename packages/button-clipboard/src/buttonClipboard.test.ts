import { expect, jest, test } from '@jest/globals';
import buttonClipboard from './buttonClipboard.ts';

Object.assign(navigator, {
	clipboard: {
		writeText: () => {
			/**/
		},
	},
});

test('正常ケース', () => {
	const element = document.createElement('button');
	element.dataset['text'] = 'Text';

	const eventSpy = jest.spyOn(element, 'addEventListener');

	buttonClipboard(element);

	element.dispatchEvent(new Event('click'));

	expect(eventSpy).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });

	eventSpy.mockRestore();
});
