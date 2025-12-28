import Text from './attribute/Text.ts';
import Title from './attribute/Title.ts';
import Url from './attribute/Url.ts';
import clickEvent from './event/click.ts';

/**
 * Share button
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (navigator.share === undefined) {
		thisElement.disabled = true;
		return;
	}

	const { text: textAttribute, title: titleAttribute, url: urlAttribute } = thisElement.dataset;

	const text = new Text(textAttribute);
	const title = new Title(titleAttribute);
	const url = new Url(urlAttribute);

	thisElement.addEventListener(
		'click',
		async (ev: MouseEvent) => {
			await clickEvent(ev, {
				text: text,
				title: title,
				url: url,
			});
		},
		{ passive: true },
	);
};
