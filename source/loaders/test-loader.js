/*
  loader就是一个函数
  当webpack解析资源时，会调用相应的loader取处理
  loader接收到文件内容作为参数，返回内容出去
  map SourceMap
  meta 别的loader传递的参数
*/

module.exports = function (content) {
  console.log(content);
  return content;
}