export type HTMLInputFileElement = HTMLInputElement & {
	accept: string;
	capture?: string;
	files: FileList;
};
