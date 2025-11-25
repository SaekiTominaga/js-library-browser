/**
 * Prevent page unloaded while filling out a form
 */
export default class {
	#submitForm = false; // フォームが送信されたか

	#changeControl = false; // フォームコントロールが変更されたか

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLFormElement) {
		Array.from(thisElement.elements).forEach((formControlElement) => {
			formControlElement.addEventListener('change', this.#formControlChangeEvent.bind(this), { once: true, passive: true });
		});

		thisElement.addEventListener('submit', this.#submitEvent.bind(this), { once: true, passive: true });
		window.addEventListener('beforeunload', this.#windowBeforeUnloadEvent.bind(this));
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	#formControlChangeEvent(): void {
		this.#changeControl = true;
	}

	/**
	 * フォームが送信されたときの処理
	 */
	#submitEvent(): void {
		this.#submitForm = true;
	}

	/**
	 * window - beforeunload の処理
	 *
	 * @param ev - Event
	 */
	#windowBeforeUnloadEvent(ev: BeforeUnloadEvent): void {
		if (!this.#submitForm && this.#changeControl) {
			ev.preventDefault();
		}
	}
}
