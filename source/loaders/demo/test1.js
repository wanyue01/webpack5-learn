// 同步loader
// 方式1
// module.exports = function (content) {
//   return content;
// };

// 方式2
module.exports = function (content, map, meta) {
  /*
    第一个参数：err 代表是否有错误，没错误填null
    第二个参数：content 处理后的内容
    第三个参数：source-map 继续传递source-map
    第四个参数：meta 给下一个loader的参数
  */
  this.callback(null, content, map, meta);
  // 同步loader不会等异步操作执行完才调用下一个loader，而是直接调用下一个loader
  // 因此同步loader中不能有异步操作

  // console.log(12);
  // setTimeout(() => {
  //   console.log('11');
  //   this.callback(null, content, map, meta);

  // },1000);
};