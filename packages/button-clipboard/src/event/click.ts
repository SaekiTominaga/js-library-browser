import Data from '../attribute/Data.ts';
import Feedback from '../attribute/Feedback.ts';
import { getContent } from '../util/html.ts';

/**
 * ボタン押下時の処理
 *
 * @param _ev - MouseEvent
 * @param data - Data
 * @param feedback - Feedback
 */
export default async (_ev: MouseEvent, data: Data, feedback: Feedback): Promise<void> => {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const content = data.text ?? getContent(data.element!); // `data-text` と `data-target` が両方指定されている場合は前者を優先する

	await navigator.clipboard.writeText(content);

	if (feedback.element !== undefined) {
		feedback.element.hidden = false;
	} else {
		console.info('Clipboard write successfully.', content);
	}
};
