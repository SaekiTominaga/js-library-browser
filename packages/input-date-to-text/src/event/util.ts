import type Max from '../attribute/Max.ts';
import type Min from '../attribute/Min.ts';
import type ValidationMessageMax from '../attribute/ValidationMessageMax.ts';
import type ValidationMessageMin from '../attribute/ValidationMessageMin.ts';
import type ValidationMessageNoExist from '../attribute/ValidationMessageNoExist.ts';

/**
 * 入力値を変換（整形）する
 *
 * @param inputValue - `<input>` 要素への入力値
 *
 * @returns 空文字または YYYY-MM-DD 形式の文字列
 */
export const convertValue = (inputValue: string): string => {
	const valueTrim = inputValue.trim();
	if (valueTrim === '') {
		return valueTrim;
	}

	/* 数字を半角化 */
	const valueHankaku = valueTrim.replace(/[０-９－／]/gu, (str) => String.fromCharCode(str.charCodeAt(0) - 0xfee0));

	if (/^[0-9]{8}$/u.test(valueHankaku)) {
		/* e.g. 20000101 → 2000-01-01 */
		return `${valueHankaku.substring(0, 4)}-${valueHankaku.substring(4, 6)}-${valueHankaku.substring(6)}`;
	}

	/* e.g. 2000/1/1 → 2000-01-01, 2000-1-1 → 2000-01-01 */
	const { 0: year, 1: month, 2: day } = valueHankaku.replaceAll('/', '-').split('-');
	if (year !== undefined && month !== undefined && day !== undefined) {
		return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	}

	return valueTrim; // `pattern` 属性を設定しているので実際には到達しない
};

/**
 * カスタムバリデーション文言を取得する
 *
 * @param convertedInputValue - 空文字または YYYY-MM-DD 形式の文字列
 * @param attributes - Attributes
 * @param attributes.min - Min
 * @param attributes.max - Max
 * @param attributes.validationMessageNoExist - ValidationMessageNoExist
 * @param attributes.validationMessageMin - ValidationMessageMin
 * @param attributes.validationMessageMax - ValidationMessageMax
 *
 * @returns カスタムバリデーション文言
 */
const getValidityMessage = (
	convertedInputValue: string,
	attributes: Readonly<{
		min: Min;
		max: Max;
		validationMessageNoExist: ValidationMessageNoExist;
		validationMessageMin: ValidationMessageMin;
		validationMessageMax: ValidationMessageMax;
	}>,
): string | undefined => {
	if (convertedInputValue === '') {
		return undefined;
	}

	const valueYear = Number(convertedInputValue.substring(0, 4));
	const valueMonth = Number(convertedInputValue.substring(5, 7)) - 1;
	const valueDay = Number(convertedInputValue.substring(8, 10));
	const valueDate = new Date(valueYear, valueMonth, valueDay);

	if (valueDate.getFullYear() !== valueYear || valueDate.getMonth() !== valueMonth || valueDate.getDate() !== valueDay) {
		/* 2月30日など存在しない日付の場合 */
		return attributes.validationMessageNoExist.value;
	}

	if (attributes.min.value !== undefined && valueDate < attributes.min.value) {
		/* `min` 属性値より過去の日付を入力した場合 */
		return attributes.validationMessageMin.value;
	}

	if (attributes.max.value !== undefined && valueDate > attributes.max.value) {
		/* `max` 属性値より未来の日付を入力した場合 */
		return attributes.validationMessageMax.value;
	}

	return undefined;
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
 * @returns 検証結果に問題がなければ true
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
	const convertedInputValue = convertValue(inputElement.value);
	const validityMessage = getValidityMessage(convertedInputValue, data);

	inputElement.value = convertedInputValue;
	inputElement.setCustomValidity(validityMessage ?? '');
	return inputElement.reportValidity();
};
