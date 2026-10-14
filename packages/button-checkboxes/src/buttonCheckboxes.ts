import Checkbox from './attribute/Checkbox.ts';
import Course from './attribute/Course.ts';
import clickEvent from './event/click.ts';

/**
 * Button to check / uncheck checkboxes group
 *
 * @param $this - Target element
 */
export default ($this: HTMLButtonElement): void => {
	const { course: courseAttribute, control: controlAttribute, controlsClass: controlsClassAttribute, controlsName: controlsNameAttribute } = $this.dataset;

	const course = new Course(courseAttribute);
	const checkbox = new Checkbox({ id: controlAttribute, class: controlsClassAttribute, name: controlsNameAttribute });

	/* `aria-controls` */
	$this.ariaControlsElements ??= checkbox.elements;

	$this.addEventListener(
		'click',
		(ev: MouseEvent) => {
			clickEvent(ev, course, checkbox);
		},
		{ passive: true },
	);
};
