import IsbnVerify from '@w0s/isbn-verify';
import type ValidationMessageIsbnCheckdigit from '../attribute/ValidationMessageIsbnCheckdigit.ts';

/**
 * カスタムバリデーション文言を取得する
 *
 * @param inputValue - 空文字または YYYY-MM-DD 形式の文字列
 * @param attributes - Attributes
 * @param attributes.validationMessageIsbnCheckdigit - ValidationMessageIsbnCheckdigit
 *
 * @returns カスタムバリデーション文言
 */
const getValidityMessage = (
	inputValue: string,
	attributes: Readonly<{
		validationMessageIsbnCheckdigit: ValidationMessageIsbnCheckdigit;
	}>,
): string | undefined => {
	if (inputValue === '') {
		return undefined;
	}

	if (!new IsbnVerify(inputValue).isValid()) {
		/* 2月30日など存在しない日付の場合 */
		return attributes.validationMessageIsbnCheckdigit.value;
	}

	return undefined;
};

/**
 * バリデーションを実行
 *
 * @param inputElement - HTMLInputElement
 * @param data - Elements and attributes
 * @param data.validationMessageIsbnCheckdigit - ValidationMessageIsbnCheckdigit
 *
 * @returns バリデーションが通れば true
 */
export const validate = (
	inputElement: HTMLInputElement,
	data: Readonly<{
		validationMessageIsbnCheckdigit: ValidationMessageIsbnCheckdigit;
	}>,
): boolean => {
	const validityMessage = getValidityMessage(inputElement.value, data);

	inputElement.setCustomValidity(validityMessage ?? '');
	return inputElement.reportValidity();
};
