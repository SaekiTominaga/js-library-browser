import type { Status } from '../../formBeforeUnloadConfirm.ts';

/**
 * `change` event
 *
 * @param _ev - Event
 * @param data - Elements, attributes and others
 * @param data.status - Status
 */
export default (
	_ev: Event,
	data: Readonly<{
		status: Status;
	}>,
): void => {
	data.status.changeControl = true;
};
