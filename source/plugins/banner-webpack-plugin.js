const { compilation } = require("webpack")

module.exports = class BannerWebpackPlugin {
  constructor(options={}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('BannerWebpackPlugin', (compilation, callback) => {
      const ext = ['js', 'css'];
      // 1. 获取即将输出的资源文件：compilation.assets
      // 2. 过滤只保留js和css资源
      const assets = Reflect.ownKeys(compilation.assets).filter((assetPath) => {
        const split = assetPath.split('.');
        const extension = split[split.length - 1];
        return ext.includes(extension);
      })

      const prefix = `/*
* Author: ${this.options.author}
*/
`
      // 3. 遍历剩下资源加上注释
      assets.forEach(asset => {
        // 获取原来内容
        const source = compilation.assets[asset].source();
        // 拼接上注释
        const content = prefix + source;

        // 修改资源
        compilation.assets[asset] = {
          // 最终资源输出时，调用source方法，source方法的返回值就是资源的具体内容
          source() {
            return content;
          },
          // 资源大小
          size() {
            return content.length;
          }
        }
      })
      callback();
    })
  }
}