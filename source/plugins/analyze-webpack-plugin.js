module.exports = class AnalyzeWebpackPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('AnalyzeWebpackPlugin', compilation => {
      // 1.遍历所有即将输出文件，得到其大小
      const assets = Object.entries(compilation.assets);
      let content = `| 资源名称 | 资源大小 |
| --- | --- |`;
      assets.forEach(([filename, file]) => {
        content += `\n| ${filename} | ${file.size()} |`;
      })
      // 2.生成md文件
      compilation.assets['analyze.md'] = {
        source() { return content },
        size() { return content.size() }
      }
    })
  }
}