module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'standard',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {},
};
