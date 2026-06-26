module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
  },
  ignorePatterns: ['dist', 'node_modules', 'playwright-report', 'test-results', 'apps-script'],
};
