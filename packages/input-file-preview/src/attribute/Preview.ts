/**
 * `data-preview` attribute
 */
export default class {
	readonly #template: HTMLTemplateElement;

	readonly #output: HTMLOutputElement;

	/**
	 * @param value - Attribute value
	 */
	constructor(value: string | null | undefined) {
		if (value === null || value === undefined) {
			throw new TypeError('The `data-preview` attribute is not set.');
		}

		const template = document.getElementById(value);
		if (template === null) {
			throw new Error(`Element \`#${value}\` not found.`);
		}
		if (!(template instanceof HTMLTemplateElement)) {
			throw new Error(`Element \`#${value}\` must be a \`<template>\` element.`);
		}
		this.#template = template;

		const output = template.content.querySelector('output');
		if (output === null) {
			throw new Error('There must be one `<output>` element within the `<template>` element.');
		}
		this.#output = output;
	}

	get template(): HTMLTemplateElement {
		return this.#template;
	}

	get outputHtml(): string {
		return 'getHTML' in this.#output ? this.#output.getHTML() : (this.#output as HTMLOutputElement).innerHTML;
	}
}
