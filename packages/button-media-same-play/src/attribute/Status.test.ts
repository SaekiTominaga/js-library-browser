import { expect, test } from '@jest/globals';
import Status from './Status.ts';

test('set', () => {
	const status = new Status();

	expect(status.paused).toBeTruthy();

	status.paused = false;
	expect(status.paused).toBeFalsy();
});

test('toggle() method', () => {
	const status = new Status();

	status.toggle();
	expect(status.paused).toBeFalsy();

	status.toggle();
	expect(status.paused).toBeTruthy();
});
