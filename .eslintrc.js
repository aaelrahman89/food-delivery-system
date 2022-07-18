module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier/vue',
  ],
  plugins: ['vue', 'sort-imports-es6-autofix', '@typescript-eslint', 'vuetify'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.ts.vue'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        tsconfigRootDir: './',
        project: './tsconfig.json',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-use-before-define': [
          'error',
          { typedefs: false },
        ],
        'no-use-before-define': 'off',
        'default-case': 'off',
        'class-methods-use-this': 'off',
      },
    },
    {
      files: [
        '**/*.spec.ts',
        '**/*.spec.js',
        '**/rootLevelHooks.js',
        '**/rootLevelHooks.ts',
      ],
      env: {
        mocha: true,
        node: true,
      },
      rules: {
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-console': 'error',
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['**/*.spec.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },

    {
      files: ['scripts/*.js'],
      env: {
        node: true,
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-console': 'off',
      },
    },
    {
      files: ['apps/**/service-worker.ts'],
      env: {
        serviceworker: true,
      },
    },
  ],
  rules: {
    'max-classes-per-file': ['error', 8],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'arrow-parens': 'error',
    'eqeqeq': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/test/**/*.js', '**/test/**/*.ts'] },
    ],
    'no-underscore-dangle': 'off',
    'prefer-destructuring': [
      'error',
      {
        array: true,
        object: true,
      },
    ],
    'max-params': ['error', 3],
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-console': 'error',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'import/order': 'off',
    'import/prefer-default-export': 'off',
    'sort-imports-es6-autofix/sort-imports-es6': [
      'warn',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'single', 'multiple', 'all'],
      },
    ],
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
  },
};
