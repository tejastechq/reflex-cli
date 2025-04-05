export default [
    {
      ignores: ["dist/**", "node_modules/**"],
    },
    {
      files: ["src/**/*.ts"],
      languageOptions: {
        parser: "@typescript-eslint/parser",
        parserOptions: {
          project: "./tsconfig.json",
        },
      },
      plugins: {
        "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      },
      rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
      },
    },
  ];