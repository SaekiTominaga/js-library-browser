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

		const templateContent = template.content;
		if (
			Array.from(templateContent.childNodes).some((node) => {
				const { nodeType, nodeValue } = node;

				if (([Node.ELEMENT_NODE, Node.COMMENT_NODE] as number[]).includes(nodeType)) {
					return false;
				}

				if (nodeType === Node.TEXT_NODE && nodeValue?.trim() === '') {
					return false;
				}

				return true;
			})
		) {
			throw new Error('There must be only Element node, comment node, or empty text node within the `<template>` element.');
		}

		const outputElement = templateContent.querySelector('output');
		if (outputElement === null) {
			throw new Error('There must be one `<output>` element within the `<template>` element.');
		}

		this.#output = outputElement;
	}

	get template(): HTMLTemplateElement {
		return this.#template;
	}

	get outputHtml(): string {
		if ('getHTML' in HTMLOutputElement) {
			return this.#output.getHTML();
		}
		return this.#output.innerHTML;
	}
}
