import ReportSameReferrer, { type Option } from './ReportSameReferrer.ts';

export default async (endpoint: string, options: Readonly<Option>): Promise<void> => {
	const reportSameReferrer = new ReportSameReferrer(endpoint, options);
	await reportSameReferrer.report();
};
