import FootnoteReferencePopover from './custom-element/FootnoteReferencePopover.ts';

export default (customeElementName: string): void => {
	if (!CSS.supports('anchor-name: --x')) {
		console.info('This browser does not support CSS anchor positioning.');
		return;
	}

	customElements.define(customeElementName, FootnoteReferencePopover);
};
