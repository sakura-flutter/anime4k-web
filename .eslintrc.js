module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/strongly-recommended',
    '@vue/standard',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
}
