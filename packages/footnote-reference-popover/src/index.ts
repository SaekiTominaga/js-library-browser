import FootnoteReferencePopover from './custom-element/FootnoteReferencePopover.ts';

export default (customElementName: string): void => {
	if (!CSS.supports('anchor-name: --x')) {
		console.warn('[@w0s/footnote-reference-popover] This browser does not support CSS anchor positioning.');
		return;
	}

	customElements.define(customElementName, FootnoteReferencePopover);
};
