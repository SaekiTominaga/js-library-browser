import IsbnVerify from '@w0s/isbn-verify';
import ValidationMessageIsbnCheckdigit from './attribute/ValidationMessageIsbnCheckdigit.ts';

/**
 * ISBN input field
 */
export default class {
	readonly #inputElement: HTMLInputElement;

	readonly #validationMessageIsbnCheckdigit: ValidationMessageIsbnCheckdigit; // チェックデジットが不正なときのメッセージ

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputElement) {
		this.#inputElement = thisElement;

		const { validationMessageIsbnCheckdigit: validationMessageIsbnCheckdigitAttribute } = thisElement.dataset;

		this.#validationMessageIsbnCheckdigit = new ValidationMessageIsbnCheckdigit(validationMessageIsbnCheckdigitAttribute);

		thisElement.minLength = 10;
		thisElement.maxLength = 17;
		thisElement.pattern = '(978|979)-[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9]|[0-9]{13}|[0-9]{1,5}-[0-9]{1,7}-[0-9]{1,7}-[0-9X]|[0-9]{9}[0-9X]';

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
		thisElement.form?.addEventListener('submit', this.#formSubmitEvent);
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	#changeEvent = (): void => {
		this.#clearMessage();

		if (this.#inputElement.validity.patternMismatch) {
			/* ブラウザ標準機能によるチェックを優先する */
			return;
		}

		this.#validate();
	};

	/**
	 * フォーム送信時の処理
	 *
	 * @param ev - Event
	 */
	#formSubmitEvent = (ev: Event): void => {
		if (!this.#validate()) {
			ev.preventDefault();
		}
	};

	/**
	 * バリデーションを実行
	 *
	 * @returns バリデーションが通れば true
	 */
	#validate(): boolean {
		if (this.#inputElement.value === '') {
			return true;
		}

		if (!new IsbnVerify(this.#inputElement.value).isValid()) {
			this.#setMessage(this.#validationMessageIsbnCheckdigit.value);

			return false;
		}

		this.#clearMessage();

		return true;
	}

	/**
	 * カスタムバリデーション文言を設定
	 *
	 * @param message - カスタムバリデーション文言
	 */
	#setMessage(message: string): void {
		this.#inputElement.setCustomValidity(message);

		this.#inputElement.dispatchEvent(new Event('invalid'));
	}

	/**
	 * カスタムバリデーション文言を削除
	 */
	#clearMessage(): void {
		this.#inputElement.setCustomValidity('');
	}
}
