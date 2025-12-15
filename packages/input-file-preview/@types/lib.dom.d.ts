export interface HTMLInputFileElement extends HTMLInputElement {
	capture?: string; // 未対応ブラウザではプロパティが存在しない https://caniuse.com/mdn-api_htmlinputelement_capture
	files: FileList;
}
