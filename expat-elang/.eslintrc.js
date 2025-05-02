module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/no-single-element-style-arrays': 'off',
    'react-native/sort-styles': 'off',
    'react-native/no-raw-text': 'off',
    'react/no-unstable-nested-components': 'off',
    'no-unused-vars': ['error', {argsIgnorePattern: '^_'}],
  },
};
