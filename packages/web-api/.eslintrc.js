module.exports = {
  root: true,
  env: {
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/all',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
};
