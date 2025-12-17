import Checkbox from '../attribute/Checkbox.ts';
import Course from '../attribute/Course.ts';

/**
 * ボタン押下時の処理
 *
 * @param _ev - MouseEvent
 * @param course - Course
 * @param checkbox - Checkbox
 */
export default (_ev: MouseEvent, course: Course, checkbox: Checkbox): void => {
	switch (course.value) {
		case 'check': {
			/* 全選択ボタン */
			checkbox.elements
				.filter((element) => !element.checked)
				.forEach((element) => {
					element.checked = true;
				});
			break;
		}
		case 'uncheck': {
			/* 全解除ボタン */
			checkbox.elements
				.filter((element) => element.checked)
				.forEach((element) => {
					element.checked = false;
				});
			break;
		}
		default:
	}
};
