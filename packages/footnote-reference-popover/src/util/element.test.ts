import { expect, test } from '@jest/globals';
import { getAnchorName } from './element.ts';

test('getAnchorName', () => {
	expect(getAnchorName()).toMatch(/--[0-9a-z]{32}/u);
});
