module.exports = {
	env: {
		node: true,
		es2021: true
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 12
	},
	ignorePatterns: ["/node_modules", "eval.js"],
	rules: {
		semi: ["error", "always"],
		quotes: ["error", "double"],
		eqeqeq: ["error", "always"],
		camelcase: "error",
		"key-spacing": "error",
		"keyword-spacing": "error",
		"no-mixed-spaces-and-tabs": "error",
		"no-multiple-empty-lines": "error",
		"prefer-arrow-callback": "error",
		"no-use-before-define": ["error", { functions: false, classes: true }],
		"no-else-return": ["error", { allowElseIf: false }],
		"prefer-const": ["error", { destructuring: "any", ignoreReadBeforeAssign: false }],
		"no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: false }]
	}
};
