import type Controls from '../attribute/Controles.ts';
import type Status from '../attribute/Status.ts';

/**
 * `click` event
 *
 * @param _ev - Event
 * @param data - Elements and attributes
 * @param data.media - `<button aria-controls>` attribute
 */
export default async (
	_ev: Event,
	data: Readonly<{
		controls: Controls;
		status: Status;
	}>,
): Promise<void> => {
	if (data.controls.elements.every((element) => element.ended)) {
		/* すべての動画が再生終了していたら最初から再生を始める */
		await Promise.all(
			data.controls.elements.map(async (targetElement) => {
				targetElement.currentTime = 0;
				await targetElement.play();
			}),
		);

		data.status.paused = false;
	} else {
		if (data.status.paused) {
			/* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
			const minTime = data.controls.elements.reduce((accumulator, currentValue) => {
				const element = accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue;
				return element;
			}).currentTime; // すべての動画の中でもっとも再生時間が低いもの

			await Promise.all(
				data.controls.elements.map(async (targetElement) => {
					targetElement.currentTime = minTime;
					await targetElement.play();
				}),
			);
		} else {
			/* 再生中だったら一時停止する */
			data.controls.elements.forEach((targetElement) => {
				targetElement.pause();
			});
		}

		data.status.toggle();
	}
};
