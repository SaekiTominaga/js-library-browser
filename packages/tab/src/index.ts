import Tab from './custom-element/Tab.ts';

export default (customElementName: string): void => {
	if (!('ariaControlsElements' in Element.prototype)) {
		console.info('This browser does not support `ariaControlsElements` property.');
		return;
	}

	customElements.define(customElementName, Tab);
};
