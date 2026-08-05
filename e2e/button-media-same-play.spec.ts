import { expect, test } from '@playwright/test';

test.beforeEach(async ({ browserName, page }) => {
	test.skip(['webkit'].includes(browserName), 'Exclude browsers that time out');

	await page.goto('/button-media-same-play/demo/');
});

test.afterEach(async ({ page }) => {
	await page.close();
});

const getCurrentTime = ($video: HTMLMediaElement): number => $video.currentTime;

const setCurrentTime = ($video: HTMLMediaElement, time: number): void => {
	$video.currentTime = time;
};

const setEndTime = ($video: HTMLMediaElement): void => {
	$video.currentTime = Math.ceil($video.duration);
};

const getPaused = ($video: HTMLMediaElement): boolean => $video.paused;

test('pause → play → pause', async ({ page }) => {
	const videos = page.locator('video');
	const video1 = videos.nth(0);
	const video2 = videos.nth(1);

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(0);
	expect(await video1.evaluate(getPaused)).toBeTruthy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(0);
	expect(await video2.evaluate(getPaused)).toBeTruthy();

	await page.getByRole('button', { name: 'Simultaneous playback' }).click();

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(0);
	expect(await video1.evaluate(getPaused)).toBeFalsy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(0);
	expect(await video2.evaluate(getPaused)).toBeFalsy();

	await page.getByRole('button', { name: 'Simultaneous playback' }).click();

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(0);
	expect(await video1.evaluate(getPaused)).toBeTruthy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(0);
	expect(await video2.evaluate(getPaused)).toBeTruthy();
});

test('difference in current time', async ({ page }) => {
	const videos = page.locator('video');
	const video1 = videos.nth(0);
	const video2 = videos.nth(1);

	await Promise.all([video1.evaluate(setCurrentTime, 1), video2.evaluate(setCurrentTime, 2)]);

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(1);
	expect(await video1.evaluate(getPaused)).toBeTruthy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(2);
	expect(await video1.evaluate(getPaused)).toBeTruthy();

	await page.getByRole('button', { name: 'Simultaneous playback' }).click();

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(1);
	expect(await video1.evaluate(getPaused)).toBeFalsy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(1);
	expect(await video2.evaluate(getPaused)).toBeFalsy();
});

test('All videos have finished playing', async ({ browserName, page }) => {
	test.skip(['chromium'].includes(browserName), 'Exclude browsers that do not correctly return `HTMLMediaElement.ended`');

	const videos = page.locator('video');
	const video1 = videos.nth(0);
	const video2 = videos.nth(1);

	await Promise.all([video1.evaluate(setEndTime), video2.evaluate(setEndTime)]);

	expect(await video1.evaluate(($video: HTMLMediaElement) => $video.ended)).toBeTruthy();
	expect(await video2.evaluate(($video: HTMLMediaElement) => $video.ended)).toBeTruthy();

	await page.getByRole('button', { name: 'Simultaneous playback' }).click();

	expect(Math.floor(await video1.evaluate(getCurrentTime))).toBe(0);
	expect(await video1.evaluate(getPaused)).toBeFalsy();
	expect(Math.floor(await video2.evaluate(getCurrentTime))).toBe(0);
	expect(await video2.evaluate(getPaused)).toBeFalsy();
});
