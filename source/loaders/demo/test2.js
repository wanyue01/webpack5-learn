// 异步loader 一定会等这个loader执行完才轮到下一个loader
module.exports = function (content, map, meta) {
  const callback = this.async();
  // 一旦callback被调用就说明这个loader完成了工作，就调用下一个loader
  setTimeout(() => {
    // console.log(2);
    // 异步操作在实际开发中要用await或promise.then
    callback(null, content, map, meta);
  }, 1000);
};