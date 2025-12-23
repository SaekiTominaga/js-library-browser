import type { Status } from '../formBeforeUnloadConfirm.ts';

/**
 * `submit` event
 *
 * @param _ev - SubmitEvent
 * @param data - Elements, attributes and others
 * @param data.status - Status
 */
export default (
	_ev: SubmitEvent,
	data: Readonly<{
		status: Status;
	}>,
): void => {
	data.status.submitForm = true;
};
