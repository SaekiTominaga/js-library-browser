import Max from './attribute/Max.ts';
import Min from './attribute/Min.ts';
import Title from './attribute/Title.ts';
import ValidationMessageMax from './attribute/ValidationMessageMax.ts';
import ValidationMessageMin from './attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from './attribute/ValidationMessageNoExist.ts';

/**
 * Convert date control to `<input type=text>`
 */
export default class {
	readonly #inputElement: HTMLInputElement; // `<input>` 要素

	readonly #min: Min;

	readonly #max: Max;

	readonly #validationMessageNoExist: ValidationMessageNoExist;

	readonly #validationMessageMin: ValidationMessageMin;

	readonly #validationMessageMax: ValidationMessageMax;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLInputElement) {
		this.#inputElement = thisElement;

		const { min: minAttribute, max: maxAttribute } = thisElement;
		const {
			title: titleAttribute,
			validationNoexist: validationNoexistAttribute,
			validationMin: validationMinAttribute,
			validationMax: validationMaxAttribute,
		} = thisElement.dataset;

		this.#min = new Min(minAttribute);
		this.#max = new Max(maxAttribute);
		const title = new Title(titleAttribute);
		this.#validationMessageNoExist = new ValidationMessageNoExist(validationNoexistAttribute);
		this.#validationMessageMin = new ValidationMessageMin(validationMinAttribute, thisElement);
		this.#validationMessageMax = new ValidationMessageMax(validationMaxAttribute, thisElement);

		/* `<input type="date">` 独自の属性を削除 */
		if (minAttribute !== '') {
			thisElement.removeAttribute('min');
		}
		if (maxAttribute !== '') {
			thisElement.removeAttribute('max');
		}
		if (thisElement.step !== '') {
			thisElement.removeAttribute('step'); // TODO: `step` 属性指定時の挙動は未実装
		}

		/* 日付コントロールを `<input type="text">` に置換 */
		thisElement.type = 'text';
		thisElement.minLength = 8;
		thisElement.pattern = '([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})';
		thisElement.placeholder = 'YYYY-MM-DD';
		if (title.value !== undefined) {
			thisElement.removeAttribute('data-title');
			thisElement.title = title.value;
		}

		thisElement.addEventListener('change', this.#changeEvent, { passive: true });
		thisElement.form?.addEventListener('submit', this.#formSubmitEvent);
	}

	/**
	 * フォームコントロールの内容が変更されたときの処理
	 */
	readonly #changeEvent = (): void => {
		if (this.#inputElement.validity.patternMismatch) {
			/* ブラウザ標準機能によるチェックを優先する */
			return;
		}

		this.#convertValue();

		this.#validate();
	};

	/**
	 * フォーム送信時の処理
	 *
	 * @param ev - Event
	 */
	readonly #formSubmitEvent = (ev: Event): void => {
		this.#convertValue();

		if (!this.#validate()) {
			ev.preventDefault();
		}
	};

	/**
	 * 入力値を変換（整形）する
	 */
	#convertValue(): void {
		const valueTrim = this.#inputElement.value.trim();
		if (valueTrim === '') {
			this.#inputElement.value = valueTrim;
			return;
		}

		/* 数字を半角化 */
		const valueHankaku = valueTrim.replace(/[０-９－／]/gu, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));

		if (/^[0-9]{8}$/u.test(valueHankaku)) {
			/* e.g. 20000101 → 2000-01-01 */
			this.#inputElement.value = `${valueHankaku.substring(0, 4)}-${valueHankaku.substring(4, 6)}-${valueHankaku.substring(6)}`;
			return;
		}

		/* e.g. 2000/1/1 → 2000-01-01, 2000-1-1 → 2000-01-01 */
		const { 0: year, 1: month, 2: day } = valueHankaku.replaceAll('/', '-').split('-');
		if (year !== undefined && month !== undefined && day !== undefined) {
			this.#inputElement.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		}
	}

	/**
	 * バリデーションを実行
	 *
	 * @returns バリデーションが通れば true
	 */
	#validate(): boolean {
		const { value } = this.#inputElement;
		if (value === '') {
			return true;
		}

		const valueYear = Number(value.substring(0, 4));
		const valueMonth = Number(value.substring(5, 7)) - 1;
		const valueDay = Number(value.substring(8, 10));
		const valueDate = new Date(valueYear, valueMonth, valueDay);

		if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
			/* 2月30日など存在しない日付の場合 */
			this.#setMessage(this.#validationMessageNoExist.value);
			return false;
		}

		if (this.#min.value !== undefined && valueDate < this.#min.value) {
			/* `min` 属性値より過去の日付を入力した場合 */
			this.#setMessage(this.#validationMessageMin.value);
			return false;
		}

		if (this.#max.value !== undefined && valueDate > this.#max.value) {
			/* `max` 属性値より未来の日付を入力した場合 */
			this.#setMessage(this.#validationMessageMax.value);
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
	#setMessage(message: string | undefined): void {
		if (message === undefined) {
			return;
		}

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
