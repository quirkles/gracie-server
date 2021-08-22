module.exports = {
	extends: [
		'plugin:@typescript-eslint/recommended',
		'xo'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module'
	}
};
