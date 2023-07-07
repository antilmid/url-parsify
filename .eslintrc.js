module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['dist/*', '.husky/*', 'debug/*'],
  extends: 'standard-with-typescript',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'comma-dangle': 0,
    semi: 0,
    '@typescript-eslint/space-before-function-paren': 0,
    'no-unmodified-loop-condition': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/no-unnecessary-type-assertion': 0,
    'no-fallthrough': 0,
    'no-return-assign': 0,
    'no-labels': 0,
    '@typescript-eslint/no-dynamic-delete': 0,
  },
};
