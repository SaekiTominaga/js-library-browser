import type PreOpen from '../../attribute/PreOpen.ts';

/**
 * `toggle` event
 *
 * @param ev - Event
 * @param data - Elements and attributes
 * @param data.preOpen - `<details data-pre-open>` attribute
 */
export default (
	ev: Event,
	data: Readonly<{
		preOpen: PreOpen;
	}>,
): void => {
	const { open } = ev.currentTarget as HTMLDetailsElement;

	if (data.preOpen.state !== open) {
		/* `<summary>` 要素のクリックを経ずに開閉状態が変化した場合（ブラウザのページ内検索など） */
		data.preOpen.state = open;
	}
};
