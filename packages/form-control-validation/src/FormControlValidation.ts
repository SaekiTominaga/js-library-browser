import ErrorMessage from './attribute/ErrorMessage.ts';
import Title from './attribute/Title.ts';

/**
 * Input validation of form control
 */
export default class {
	readonly #thisElement: HTMLElement; // 対象要素

	readonly #formControlElements = new Set<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(); // フォームコントロール要素

	readonly #title: Title; // title 属性

	readonly #errorMessage: ErrorMessage; // バリデーションメッセージを表示する要素

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLElement) {
		this.#thisElement = thisElement;

		const titleAttribute = thisElement.getAttribute('title');
		const ariaErrormessageAttribute = thisElement.getAttribute('aria-errormessage');

		this.#title = new Title(titleAttribute);
		const errorMessage = new ErrorMessage(ariaErrormessageAttribute);
		errorMessage.element.setAttribute('role', 'alert');
		this.#errorMessage = errorMessage;

		if (['input', 'select', 'textarea'].includes(thisElement.tagName.toLowerCase())) {
			this.#formControlElements.add(thisElement as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement);
		} else if (thisElement.getAttribute('role') === 'radiogroup') {
			thisElement.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach((inputRadioElement) => {
				this.#formControlElements.add(inputRadioElement);
			});
		} else {
			throw new Error('The `FormControlValidation` feature can only be specified for `<input>`, `<select>`, `<textarea>` or `<XXX role=radiogroup>`.');
		}

		this.#formControlElements.forEach((formControlElement) => {
			formControlElement.addEventListener('change', this.#changeEvent.bind(this), { passive: true });
			formControlElement.addEventListener('invalid', this.#invalidEvent.bind(this));
		});
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	#changeEvent(): void {
		/* バリデーション文言をいったんクリア */
		this.#clearMessage();

		this.#formControlElements.forEach((formControlElement) => {
			if (!formControlElement.validity.valid) {
				/* バリデーション文言を設定 */
				formControlElement.dispatchEvent(new UIEvent('invalid'));
			}
		});
	}

	/**
	 * Invalid 発生時の処理
	 *
	 * @param ev - Event
	 */
	#invalidEvent(ev: Event): void {
		const targetElement = ev.currentTarget as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

		/* バリデーション文言を設定する */
		let message = targetElement.validationMessage; // ブラウザのデフォルトメッセージ

		const { validity } = targetElement;
		if (!validity.valueMissing) {
			if (validity.patternMismatch && this.#title.value !== undefined) {
				/* title 属性が設定されている場合 */
				message = this.#title.value;
			}
		}

		this.#setMessage(message);

		ev.preventDefault();
	}

	/**
	 * カスタムバリデーション文言を設定
	 *
	 * @param message - カスタムバリデーション文言
	 */
	#setMessage(message: string): void {
		this.#thisElement.setAttribute('aria-invalid', 'true');

		this.#formControlElements.forEach((formControlElement) => {
			formControlElement.setCustomValidity(message);
		});

		this.#errorMessage.element.hidden = false;
		this.#errorMessage.element.textContent = message;
	}

	/**
	 * カスタムバリデーション文言を削除
	 */
	#clearMessage(): void {
		this.#thisElement.setAttribute('aria-invalid', 'false');

		this.#formControlElements.forEach((formControlElement) => {
			formControlElement.setCustomValidity('');
		});

		this.#errorMessage.element.hidden = true;
		this.#errorMessage.element.textContent = '';
	}
}
