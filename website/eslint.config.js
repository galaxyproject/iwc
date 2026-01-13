import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs["flat/recommended"],

    {
        files: ["**/*.vue"],
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
            },
        },
    },

    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            // Unused vars (allow underscore prefix for intentionally unused)
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],

            // Disable Vue formatting rules that conflict with Prettier (tabWidth: 4)
            "vue/html-indent": "off",
            "vue/max-attributes-per-line": "off",
            "vue/html-closing-bracket-newline": "off",
            "vue/singleline-html-element-content-newline": "off",
            "vue/multiline-html-element-content-newline": "off",
            "vue/first-attribute-linebreak": "off",
            "vue/html-self-closing": "off",

            // Relax some Vue rules
            "vue/multi-word-component-names": "off",
            "vue/no-v-html": "off",
        },
    },

    {
        ignores: ["dist/", ".astro/", "node_modules/", "public/data/"],
    },
);
