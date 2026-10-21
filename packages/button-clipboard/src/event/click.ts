import type Data from '../attribute/Data.ts';
import type Feedback from '../attribute/Feedback.ts';
import { getContent } from '../util/html.ts';

/**
 * ボタン押下時の処理
 *
 * @param _ev - MouseEvent
 * @param data - Data
 * @param feedback - Feedback
 */
export default async (_ev: MouseEvent, data: Data, feedback: Feedback): Promise<void> => {
	const content = data.text ?? getContent(data.$element); // `data-text` と `data-target` が両方指定されている場合は前者を優先する
	if (content === undefined) {
		return; // 到達不可
	}

	await navigator.clipboard.writeText(content);

	if (feedback.$element !== undefined && feedback.text !== undefined) {
		const { $element, text, duration } = feedback;

		$element.value = '';
		$element.getBoundingClientRect(); // レイアウト再計算のテクニック
		$element.value = text;

		if (duration !== undefined) {
			const existingTimeoutId = $element.dataset['timeoutId'];
			if (existingTimeoutId !== undefined) {
				clearTimeout(Number(existingTimeoutId));
			}

			const timeoutId = setTimeout(() => {
				$element.value = $element.defaultValue;
				delete $element.dataset['timeoutId'];
			}, duration);

			$element.dataset['timeoutId'] = String(Number(timeoutId));
		}
	} else {
		console.info(`Copied to clipboard!: ${content}`);
	}
};
