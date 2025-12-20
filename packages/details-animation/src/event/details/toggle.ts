import type PreOpen from '../../attribute/PreOpen.ts';

/**
 * `toggle` event
 *
 * @param _ev - Event
 * @param detailsElement - HTMLDetailsElement
 * @param options -
 */
export default (
	_ev: Event,
	detailsElement: HTMLDetailsElement,
	options: Readonly<{
		preOpen: PreOpen;
	}>,
): void => {
	const { open } = detailsElement;

	if (options.preOpen.state !== open) {
		/* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
		options.preOpen.state = open;
	}
};
