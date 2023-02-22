module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true
	},
	extends: [
		"plugin:react/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	plugins: [
		"react",
		"@typescript-eslint",
	],
	rules: {
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"prefer-template": "error",
		"prefer-const": "error",
		"object-curly-spacing": ["error", "always"],
		"react/display-name": "off",

		// Don't error just because we specify the type on a class property when also assigning it a default value
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-empty-function": "off"
	},
	// Not sure if this works, see if it removes the "version not detected" warning in eslint output
	settings: {
		react: {
			version: "detect"
		}
	}
};
