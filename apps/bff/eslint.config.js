import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            "@typescript-eslint": tseslint,
        },
        rules: {
            "no-unused-vars": "off",
            "no-undef": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "@typescript-eslint/no-explicit-any": "warn",
            "preserve-caught-error": "off",
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
];
