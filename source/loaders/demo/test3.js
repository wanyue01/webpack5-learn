// raw loader 接收到的content是Buffer数据
// 一般用来处理图片
module.exports = function (content) {
  console.log(content);
  return content;
};

module.exports.raw = true;