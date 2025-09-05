import Overlay from './attribute/Overlay.ts';

/**
 * Cover the entire screen with an overlay when form submitting
 */
export default class {
	readonly #overlayElement: Overlay; // ロード中メッセージを表示する要素

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLFormElement) {
		const { overlayedBy: overlayedByAttribute } = thisElement.dataset;

		this.#overlayElement = new Overlay(overlayedByAttribute);

		thisElement.addEventListener('submit', this.#submitEvent.bind(this), { passive: true });
		window.addEventListener('unload', this.#windowUnloadEvent.bind(this), { passive: true });
	}

	/**
	 * フォームが送信されたときの処理
	 */
	#submitEvent(): void {
		this.#overlayElement.element.showModal();
	}

	/**
	 * window - unload の処理
	 */
	#windowUnloadEvent(): void {
		this.#overlayElement.element.close();
	}
}
