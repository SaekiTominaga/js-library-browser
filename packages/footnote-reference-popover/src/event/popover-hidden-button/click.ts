import type PopoverElement from '../../custom-element/Popover.ts';

/**
 * `click` event
 *
 * @param _ev - MouseEvent
 * @param data - Elements, attributes and another data
 * @param data.popoverElement - PopoverElement
 */
export default (
	_ev: MouseEvent,
	data: Readonly<{
		popoverElement: PopoverElement;
	}>,
): void => {
	clearTimeout(data.popoverElement.mouseenterTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `mouseenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
};
