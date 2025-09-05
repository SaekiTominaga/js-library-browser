import { describe, afterEach, test, expect } from '@jest/globals';
import ButtonShare from './ButtonShare.ts';

describe('attribute', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	test('all attribute', () => {
		document.body.insertAdjacentHTML('beforeend', '<button data-text="Message text" data-title="Page title" data-url="/path/to">Share</button>');

		new ButtonShare(document.querySelector('button')!);

		expect(document.body.innerHTML).toBe('<button data-text="Message text" data-title="Page title" data-url="/path/to" disabled="">Share</button>'); // Jest は `navigator.share` 未対応なので `disabled` 属性が付与される
	});
});
