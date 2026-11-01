import InputSwitch from './custom-element/InputSwitch.ts';

export default (customElementName: string): void => {
	if (typeof ElementInternals === 'undefined' || !('states' in ElementInternals.prototype)) {
		console.warn('[@w0s/input-switch] This browser does not support `CustomStateSet`.');
		return;
	}

	customElements.define(customElementName, InputSwitch);
};
