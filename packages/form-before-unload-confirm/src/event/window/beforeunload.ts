import type { Status } from '../../formBeforeUnloadConfirm.ts';

/**
 * `beforeunload` event
 *
 * @param ev - BeforeUnloadEvent
 * @param data - Elements, attributes and others
 * @param data.status - Status
 */
export default (
	ev: BeforeUnloadEvent,
	data: Readonly<{
		status: Status;
	}>,
): void => {
	if (!data.status.submitForm && data.status.changeControl) {
		ev.preventDefault();
	}
};
