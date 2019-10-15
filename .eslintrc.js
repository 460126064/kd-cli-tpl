// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 7
  },
  globals: {
    import: true
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // 添加自定义校验规则
  rules: {
    // 允许async异步函数
    'generator-star-spacing': 'off',
    // 生产环境去除debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    //缩进
    "indent": ['warn', 2, {"SwitchCase": 1}],
    //注释缩进
    'spaced-comment': 'off',
    'no-trailing-spaces': 'off',
    //文件结尾换行
    'eol-last': 'off',
    //强制===
    'eqeqeq': 'off',
    //避免iview组件标签与原生标签冲突
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    //声明，但不使用
    "no-unused-vars": ['warn', {
      "args": "none"
    }],
    "vue/no-unused-components": ['off'],
    "vue/no-use-v-if-with-v-for": ['off'],
    "no-useless-escape": ['off'],
    "one-var": ['off']
  }
}
