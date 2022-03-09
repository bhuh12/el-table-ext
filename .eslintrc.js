/**
 * ESlint 配置
 * ESlint: https://eslint.org/docs/rules/
 * Vue ESlint: https://eslint.vuejs.org/rules/
 */

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': isProd ? 'off' : 'warn',
    'no-debugger': isProd ? 'off' : 'warn',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-prototype-builtins': 'off',
    'vue/no-v-html': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': 'off',
    // Vue 单文件块空行
    'vue/padding-line-between-blocks': 2,
    // 多行属性添加空行
    'vue/new-line-between-multi-line-property': [
      'error',
      {
        minLineOfMultilineProperty: 2
      }
    ],

    // 函数返回值类型
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  }
}
