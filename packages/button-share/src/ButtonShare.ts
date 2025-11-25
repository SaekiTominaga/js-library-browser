import Text from './attribute/Text.ts';
import Title from './attribute/Title.ts';
import Url from './attribute/Url.ts';

/**
 * Share button
 */
export default class {
	readonly #text: Text | undefined;

	readonly #title: Title | undefined;

	readonly #url: Url | undefined;

	/**
	 * @param thisElement - Target element
	 */
	constructor(thisElement: HTMLButtonElement) {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (navigator.share === undefined) {
			thisElement.disabled = true;
			return;
		}

		const { text: textAttribute, title: titleAttribute, url: urlAttribute } = thisElement.dataset;

		this.#text = new Text(textAttribute);
		this.#title = new Title(titleAttribute);
		this.#url = new Url(urlAttribute);

		thisElement.addEventListener('click', this.#clickEvent, { passive: true });
	}

	/**
	 * ボタン押下時の処理
	 */
	readonly #clickEvent = async (): Promise<void> => {
		await navigator.share({
			/* files: TODO: */
			text: this.#text?.text ?? '',
			title: this.#title?.text ?? document.title,
			url: this.#url?.url?.toString() ?? document.URL,
		});
	};
}
