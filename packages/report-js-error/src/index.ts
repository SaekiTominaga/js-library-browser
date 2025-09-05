import ReportJsError, { type Option } from './ReportJsError.ts';

export default (endpoint: string, options: Readonly<Option>): void => {
	new ReportJsError(endpoint, options);
};
