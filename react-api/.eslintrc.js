module.exports = {
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  ignorePatterns: ['webpack*.config.js', '*.d.ts', 'configs*'],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    },
  },
  // Fine tune rules
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'no-case-declarations': 'off',
    'no-continue': 'warn',
    'no-underscore-dangle': [2, { allowAfterThis: true }],
    'no-unused-vars': 'warn',
    'no-plusplus': 'off',
    'no-console': 'warn',
    'no-await-in-loop': 'warn',
    'max-len': ['warn', { code: 120, ignorePattern: 'import*' }],
    indent: 'off',
    '@typescript-eslint/indent': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
};
