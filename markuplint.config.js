// @ts-check

/** @type {import('@markuplint/ml-config').Config} */
export default {
	extends: ['@w0s/markuplint-config'],
	rules: {
		'no-empty-palpable-content': false,
	},
	overrideMode: 'merge',
	overrides: {
		'packages/button-clipboard/demo/index.html': {
			nodeRules: [
				{
					selector: 'textarea',
					rules: {
						'require-accessible-name': false,
					},
				},
			],
		},
		'packages/form-control-validation/demo/index.html': {
			nodeRules: [
				{
					selector: 'option[label]',
					rules: {
						'permitted-contents': false,
						'require-accessible-name': false,
					},
				},
			],
		},
		'packages/input-switch/demo/index.html': {
			rules: {
				'label-for-references-labelable': false,
			},
		},
	},
};
