import formControlChangeEvent from './event/form-control/change.ts';
import windowBeforeUnloadEvent from './event/window/beforeunload.ts';
import submitEvent from './event/submit.ts';

export interface Status {
	submitForm: boolean; // フォームが送信されたか
	changeControl: boolean; // フォームコントロールが変更されたか
}

/**
 * Prevent page unloaded while filling out a form
 *
 * @param thisElement - Target element
 */
export default (thisElement: HTMLFormElement): void => {
	const status: Status = {
		submitForm: false, // フォームが送信されたか
		changeControl: false, // フォームコントロールが変更されたか
	};

	Array.from(thisElement.elements).forEach((formControlElement) => {
		formControlElement.addEventListener(
			'change',
			(ev: Event) => {
				formControlChangeEvent(ev, {
					status: status,
				});
			},
			{ once: true, passive: true },
		);
	});

	thisElement.addEventListener(
		'submit',
		(ev: SubmitEvent) => {
			submitEvent(ev, {
				status: status,
			});
		},
		{ once: true, passive: true },
	);

	const windowBeforeUnloadEventListener = (ev: BeforeUnloadEvent) => {
		windowBeforeUnloadEvent(ev, {
			status: status,
		});
	};
	window.addEventListener('beforeunload', windowBeforeUnloadEventListener);
	window.addEventListener(
		'unload',
		() => {
			window.removeEventListener('beforeunload', windowBeforeUnloadEventListener);
		},
		{ once: true, passive: true },
	);
};
