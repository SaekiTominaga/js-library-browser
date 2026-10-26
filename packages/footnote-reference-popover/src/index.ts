import FootnoteReferencePopover from './custom-element/FootnoteReferencePopover.ts';

export default (customElementName: string): void => {
	if (!CSS.supports('anchor-name: --x')) {
		console.info('This browser does not support CSS anchor positioning.');
		return;
	}

	customElements.define(customElementName, FootnoteReferencePopover);
};
