const js = require("@eslint/js");
const globals = require("globals");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    file: ["**/*.{js,cjs,mjs}"],
    ignore: ["{dist,build}/**"],
  },
  js.configs.recommended,
  eslintConfigPrettier,
];
