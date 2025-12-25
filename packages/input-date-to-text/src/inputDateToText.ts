import Max from './attribute/Max.ts';
import Min from './attribute/Min.ts';
import Title from './attribute/Title.ts';
import ValidationMessageMax from './attribute/ValidationMessageMax.ts';
import ValidationMessageMin from './attribute/ValidationMessageMin.ts';
import ValidationMessageNoExist from './attribute/ValidationMessageNoExist.ts';
import formSubmitEvent from './event/form/submit.ts';
import changeEvent from './event/change.ts';

/**
 * Convert date control to `<input type=text>`
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLInputElement): void => {
	const { min: minAttribute, max: maxAttribute } = thisElement;
	const {
		title: titleAttribute,
		validationNoexist: validationNoexistAttribute,
		validationMin: validationMinAttribute,
		validationMax: validationMaxAttribute,
	} = thisElement.dataset;

	const min = new Min(minAttribute);
	const max = new Max(maxAttribute);
	const title = new Title(titleAttribute);
	const validationMessageNoExist = new ValidationMessageNoExist(validationNoexistAttribute);
	const validationMessageMin = new ValidationMessageMin(validationMinAttribute, thisElement);
	const validationMessageMax = new ValidationMessageMax(validationMaxAttribute, thisElement);

	/* `<input type="date">` 独自の属性を削除 */
	if (minAttribute !== '') {
		thisElement.removeAttribute('min');
	}
	if (maxAttribute !== '') {
		thisElement.removeAttribute('max');
	}
	if (thisElement.step !== '') {
		thisElement.removeAttribute('step'); // TODO: `step` 属性指定時の挙動は未実装
	}

	/* 日付コントロールを `<input type="text">` に置換 */
	thisElement.type = 'text';
	thisElement.minLength = 8;
	thisElement.pattern = '([0-9０-９]{8})|([0-9０-９]{4}[\\-\\/－／][0-9０-９]{1,2}[\\-\\/－／][0-9０-９]{1,2})';
	thisElement.placeholder = 'YYYY-MM-DD';
	if (title.value !== undefined) {
		thisElement.removeAttribute('data-title');
		thisElement.title = title.value;
	}

	thisElement.addEventListener(
		'change',
		(ev: Event) => {
			changeEvent(ev, {
				min: min,
				max: max,
				validationMessageNoExist: validationMessageNoExist,
				validationMessageMin: validationMessageMin,
				validationMessageMax: validationMessageMax,
			});
		},
		{ passive: true },
	);

	thisElement.form?.addEventListener('submit', (ev: SubmitEvent) => {
		formSubmitEvent(ev, {
			inputElement: thisElement,
			min: min,
			max: max,
			validationMessageNoExist: validationMessageNoExist,
			validationMessageMin: validationMessageMin,
			validationMessageMax: validationMessageMax,
		});
	});
};
