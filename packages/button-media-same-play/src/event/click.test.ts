import { beforeAll, expect, test } from '@jest/globals';
import Controles from '../attribute/Controles.ts';
import Status from '../attribute/Status.ts';
import clickEvent from './click.ts';

beforeAll(() => {
	document.body.innerHTML = `
<video id="video1"></video>
<video id="video2"></video>
`;
});

test('一時停止中', async () => {
	const controls = new Controles('video1 video2');
	const status = new Status();

	const event = new MouseEvent('click');

	await clickEvent(event, {
		controls: controls,
		status: status,
	});

	expect(status.paused).toBeFalsy();
});

test('再生中', async () => {
	const controls = new Controles('video1 video2');
	const status = new Status();
	status.paused = false;

	const event = new MouseEvent('click');

	await clickEvent(event, {
		controls: controls,
		status: status,
	});

	expect(status.paused).toBeTruthy();
});

/* TODO: すべての動画が再生終了していた場合のテストケース抜け（HTMLMediaElement.ended のエミュレートができないのでテスト不可） */
