module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react', 'unused-imports'],
  rules: {
    'react/prop-types': 'off',
    // React Native / modern React
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',

    // Let unused-imports plugin handle cleanup
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
};
