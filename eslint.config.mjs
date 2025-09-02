import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: {...globals.browser, ...globals.jest} }},
  pluginJs.configs.recommended,
  {
    files: ["webpack.config.js"],
    languageOptions: {
      globals: globals.node
    }
  }
];