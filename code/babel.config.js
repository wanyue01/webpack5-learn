module.exports = {
  // 智能预设：能够编译es6语法
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: {
        version: '3.25',
        proposals: true
      }
    }]
  ]
}