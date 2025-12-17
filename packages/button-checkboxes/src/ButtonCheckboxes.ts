import Checkbox from './attribute/Checkbox.ts';
import Course from './attribute/Course.ts';
import clickEvent from './event/click.ts';

/**
 * Button to check / uncheck checkboxes group
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLButtonElement): void => {
	const {
		course: courseAttribute,
		control: controlAttribute,
		controlsClass: controlsClassAttribute,
		controlsName: controlsNameAttribute,
	} = thisElement.dataset;

	const course = new Course(courseAttribute);
	const checkbox = new Checkbox({ id: controlAttribute, class: controlsClassAttribute, name: controlsNameAttribute });

	/* `aria-controls` の設定 */
	if (thisElement.getAttribute('aria-controls') === null) {
		const checkboxIds = checkbox.elements.map((checkboxElement): string => {
			if (checkboxElement.id === '') {
				checkboxElement.id = crypto.randomUUID(); // チェックボックスの ID が指定されていない場合はランダム生成
			}
			return checkboxElement.id;
		});

		thisElement.setAttribute('aria-controls', checkboxIds.join(' '));
	}

	thisElement.addEventListener(
		'click',
		(ev: MouseEvent) => {
			clickEvent(ev, course, checkbox);
		},
		{ passive: true },
	);
};
