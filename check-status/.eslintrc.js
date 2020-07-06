'use strict';

module.exports = {
	extends: [
		'eslint:recommended',
		'airbnb-base'
	],
	env: {
		/**
		 * Enable all ECMAScript 6 features except for modules
		 * (this automatically sets the ecmaVersion parser option to 6).
		 */
		es6: true,
		/**
		 * CommonJS global variables and CommonJS scoping
		 * (use this for browser-only code that uses Browserify/WebPack).
		 */
		commonjs: false,
		/**
		 * Node.js global variables and Node.js scoping.
		 */
		node: true,
		/**
		 * Browser global variables.
		 */
		browser: false
	},
	rules: {
		'import/no-unresolved': 'off',

		// some formatters like WebStorm align variables/chained functions with spaces
		'no-mixed-spaces-and-tabs': 'off',
		'arrow-parens': ['error', 'always'],
		'quote-props': 'off',
		'linebreak-style': ['error', 'unix'],
		'no-plusplus': 'off',
		'no-param-reassign': 'off',
		'lines-between-class-members': 'off',
		'class-methods-use-this': 'off',
		'no-else-return': 'error',
		'template-curly-spacing': ['error', 'never'],
		'prefer-destructuring': 'off',
		'arrow-body-style': 'off',
		'radix': 'off',
		'no-tabs': 'off',
		'comma-dangle': 'off',
		'indent': ['error', 'tab'],
		'no-console': 'error',
		'quotes': [
			'error',
			'single',
			{
				'avoidEscape': true,
				'allowTemplateLiterals': true
			}
		],
		'no-use-before-define': [
			'error',
			{
				'functions': false,
				'classes': true,
				'variables': true
			}
		],
		'no-duplicate-imports': [
			'error',
			{
				'includeExports': true
			}
		],
		'prefer-arrow-callback': [
			'error',
			{
				'allowNamedFunctions': true
			}
		],
		'use-isnan': 'error',
		'no-trailing-spaces': 'error',
		'camelcase': 'error',
		'eol-last': ['error', 'always'],
		'semi': ['error', 'always'],
		'curly': ['error', 'all'],
		'dot-notation': 'error',
		'no-multiple-empty-lines': [
			'error',
			{'max': 1, 'maxBOF': 0, 'maxEOF': 1}],
		'padding-line-between-statements': [
			'error',
			{
				blankLine: 'always',
				prev: ['const', 'let', 'var', 'block', 'block-like'],
				next: '*'
			},
			{
				blankLine: 'any',
				prev: ['const', 'let', 'var'],
				next: ['const', 'let', 'var']
			},
			{blankLine: 'always', prev: 'directive', next: '*'},
			{blankLine: 'never', prev: 'directive', next: 'directive'},
			{blankLine: 'always', prev: 'directive', next: 'directive'}
		],
		'no-underscore-dangle': 'off',
		'strict': ['error', 'safe'],
		'no-restricted-syntax': [
			'error',
			{
				selector: 'ForInStatement',
				message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
			},
			{
				selector: 'LabeledStatement',
				message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
			},
			{
				selector: 'WithStatement',
				message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
			}
		],
		'valid-jsdoc': [
			'error',
			{
				'requireReturn': false,
				'requireParamDescription': false,
				'requireReturnDescription': false
			}
		],
		'require-jsdoc': 'off',
		'max-len': [
			'error',
			{
				'code': 140,
				'comments': 160
			}
		],
		'no-unused-expressions': [
			'error', {
				allowShortCircuit: true,
				allowTernary: true,
				allowTaggedTemplates: false
			}
		],
		'no-unused-vars': [
			'error', {
				vars: 'all',
				/*
				 sometimes we intentionally have unused args (for incorrectly
				 overloaded functions, abstract classes, etc.)
				  */
				args: 'none',
				ignoreRestSiblings: true
			}
		],
		'implicit-arrow-linebreak': 'off',
		'object-shorthand': 'off',
		'comma-spacing': 'error',
		'no-await-in-loop': 'off',
	},
	parserOptions: {
		sourceType: 'script'
	},
};
