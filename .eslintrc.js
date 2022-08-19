module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "google",
    "prettier", // must be last
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    camelcase: 0,
    "no-undef": "error",
    "prettier/prettier": "warn", // TODO: change this to error in the future
    "require-jsdoc": 0,
  },
};
