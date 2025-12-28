import type Text from '../attribute/Text.ts';
import type Title from '../attribute/Title.ts';
import type Url from '../attribute/Url.ts';

/**
 * `click` event
 *
 * @param _ev - Event
 * @param data - Elements and attributes
 * @param data.text - `<button data-text>` attribute
 * @param data.title - `<button data-title>` attribute
 * @param data.url - `<button data-url>` attribute
 *
 * @returns `window.confirm()` の結果
 */
export default async (
	_ev: Event,
	data: Readonly<{
		text: Text;
		title: Title;
		url: Url;
	}>,
): Promise<void> => {
	await navigator.share({
		/* files: TODO: */
		text: data.text.text ?? '',
		title: data.title.text ?? document.title,
		url: data.url.url?.toString() ?? document.URL,
	});
};
