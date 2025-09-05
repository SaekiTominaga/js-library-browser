import Media from './attribute/Media.ts';

/**
 * Simultaneous playback button for multiple audio / video
 */
export default class {
	readonly #media: Media; // 同時再生する要素

	#paused = true; // ボタンのステータス：一時停止中かどうか

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		const ariaControlsAttribute = thisElement.getAttribute('aria-controls');

		this.#media = new Media(ariaControlsAttribute);

		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	#clickEvent = async (): Promise<void> => {
		if (this.#media.elements.every((element) => element.ended)) {
			/* すべての動画が再生終了していたら最初から再生を始める */
			await Promise.all(
				this.#media.elements.map(async (targetElement) => {
					targetElement.currentTime = 0;
					await targetElement.play();
				}),
			);

			this.#paused = false;
		} else {
			if (this.#paused) {
				/* 一時停止中だったらもっとも再生時間が低い動画に合わせて再生する */
				const minTime = this.#media.elements.reduce((accumulator, currentValue) => {
					const element = accumulator.currentTime < currentValue.currentTime ? accumulator : currentValue;
					return element;
				}).currentTime; // すべての動画の中でもっとも再生時間が低いもの

				await Promise.all(
					this.#media.elements.map(async (targetElement) => {
						targetElement.currentTime = minTime;
						await targetElement.play();
					}),
				);
			} else {
				/* 再生中だったら一時停止する */
				this.#media.elements.forEach((targetElement) => {
					targetElement.pause();
				});
			}

			this.#paused = !this.#paused;
		}
	};
}
