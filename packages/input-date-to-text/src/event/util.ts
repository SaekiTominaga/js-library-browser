import type Max from '../attribute/Max.ts';
import type Min from '../attribute/Min.ts';
import type ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import type ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import type ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';

/**
 * 入力値を変換（整形）する
 *
 * @param inputElement - HTMLInputElement
 */
export const convertValue = (inputElement: HTMLInputElement): void => {
	const valueTrim = inputElement.value.trim();
	if (valueTrim === '') {
		inputElement.value = valueTrim;
		return;
	}

	/* 数字を半角化 */
	const valueHankaku = valueTrim.replace(/[０-９－／]/gu, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));

	if (/^[0-9]{8}$/u.test(valueHankaku)) {
		/* e.g. 20000101 → 2000-01-01 */
		inputElement.value = `${valueHankaku.substring(0, 4)}-${valueHankaku.substring(4, 6)}-${valueHankaku.substring(6)}`;
		return;
	}

	/* e.g. 2000/1/1 → 2000-01-01, 2000-1-1 → 2000-01-01 */
	const { 0: year, 1: month, 2: day } = valueHankaku.replaceAll('/', '-').split('-');
	if (year !== undefined && month !== undefined && day !== undefined) {
		inputElement.value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	}
};

/**
 * カスタムバリデーション文言を設定
 *
 * @param inputElement - HTMLInputElement
 * @param message - カスタムバリデーション文言
 */
const setMessage = (inputElement: HTMLInputElement, message: string | undefined): void => {
	if (message === undefined) {
		return;
	}

	inputElement.setCustomValidity(message);

	inputElement.dispatchEvent(new Event('invalid'));
};

/**
 * カスタムバリデーション文言を削除
 *
 * @param inputElement - HTMLInputElement
 */
const clearMessage = (inputElement: HTMLInputElement): void => {
	inputElement.setCustomValidity('');
};

/**
 * バリデーションを実行
 *
 * @param inputElement - HTMLInputElement
 * @param data - Elements and attributes
 * @param data.min - Min
 * @param data.max - Max
 * @param data.validationMessageNoExist - ValidationMessageNoExist
 * @param data.validationMessageMin - ValidationMessageMin
 * @param data.validationMessageMax - ValidationMessageMax
 *
 * @returns バリデーションが通れば true
 */
export const validate = (
	inputElement: HTMLInputElement,
	data: Readonly<{
		min: Min;
		max: Max;
		validationMessageNoExist: ValidationMessageNoExist;
		validationMessageMin: ValidationMessageMin;
		validationMessageMax: ValidationMessageMax;
	}>,
): boolean => {
	convertValue(inputElement);

	const { value } = inputElement;
	if (value === '') {
		clearMessage(inputElement);
		return true;
	}

	const valueYear = Number(value.substring(0, 4));
	const valueMonth = Number(value.substring(5, 7)) - 1;
	const valueDay = Number(value.substring(8, 10));
	const valueDate = new Date(valueYear, valueMonth, valueDay);

	if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
		/* 2月30日など存在しない日付の場合 */
		setMessage(inputElement, data.validationMessageNoExist.value);
		return false;
	}

	if (data.min.value !== undefined && valueDate < data.min.value) {
		/* `min` 属性値より過去の日付を入力した場合 */
		setMessage(inputElement, data.validationMessageMin.value);
		return false;
	}

	if (data.max.value !== undefined && valueDate > data.max.value) {
		/* `max` 属性値より未来の日付を入力した場合 */
		setMessage(inputElement, data.validationMessageMax.value);
		return false;
	}

	clearMessage(inputElement);
	return true;
};
