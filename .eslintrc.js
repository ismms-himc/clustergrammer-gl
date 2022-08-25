module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier", // must be last
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "import/newline-after-import": ["error", { count: 1 }],
    "prettier/prettier": "warn", // TODO: change this to error in the future
    camelcase: 0,
    "no-undef": "error",
    "require-jsdoc": 0,
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
};
