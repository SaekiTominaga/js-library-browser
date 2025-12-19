import type PopoverElement from '../../custom-element/Popover.ts';

/**
 * `click` event
 *
 * @param _ev - MouseEvent
 * @param popover - PopoverElement
 */
export default (_ev: MouseEvent, popover: PopoverElement): void => {
	clearTimeout(popover.mouseenterTimeoutId); // タッチデバイスで閉じるボタンをタップした際に `mouseenter` イベントの発火により表示処理が遅延実行されるのを防ぐ
};
