module.exports = function (content) {

  /*
    1.直接使用style-loader只能处理样式
      不能处理样式中引入的其他资源
    2.借助css-loader解决样式中引入其他资源的问题
      问题是css-loader暴露了一段js代码，style-loader需要执行js代码，得到返回值，再动态创建style标签，插入到页面上
      不好操作
    3.style-loader中使用pitch loader解决
  */
  // const script = `
  // const styleEl = document.createElement('style');
  // styleEl.innerHTML = ${JSON.stringify(content)};
  // document.head.appendChild(styleEl);
  // `;
  // return script;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  // remainingRequest 剩下还未执行的pitch loader，到要处理的资源为止
  // console.log(remainingRequest);
  // D:\Users\jun\Desktop\webpack-learn\source\node_modules\css-loader\dist\cjs.js!D:\Users\jun\Desktop\webpack-learn\source\src\css\index.css

  // 1.将remainingRequest中的绝对路径改为相对路径（因为后面只能使用相对路径）
  const relativePath = remainingRequest.split('!')
    .map(absolutePath => {
      // this.context当前要处理的资源的路径
      return this.utils.contextify(this.context, absolutePath);
    })
    .join('!');
  // 2.引入css-loader处理后的资源
  // 3.创建style，将内容插入页面中生效
  const script = `
    import style from '!!${relativePath}';
    const styleEl = document.createElement('style');
    styleEl.innerHTML = style;
    document.head.appendChild(styleEl);
  `;
  // 熔断loader，把结果直接交给webpack打包的文件
  return script;
}