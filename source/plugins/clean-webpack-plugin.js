
module.exports = class CleanWebpackPlugin {
  apply(compiler) {
    // 2. 获取打包输出的目录
    const outputPath = compiler.options.output.path;
    const fs = compiler.outputFileSystem;
    // 1. 注册钩子：在打包输出之前 emit
    compiler.hooks.emit.tap('CleanWebpackPlugin', compilation => {
      // 3. 通过fs删除打包输出的目录下所有的文件
      console.log('output',outputPath);
      this.removeFile(fs, outputPath);
    })
  }

  removeFile(fs, filepath) {
    // 1. 读取当前目录下所有资源
    const files = fs.readdirSync(filepath);
    // 2. 遍历删除
    files.forEach(file => {
      const path = `${filepath}/${file}`;
      const fileStat = fs.statSync(path);
      if (fileStat.isDirectory()) {
        this.removeFile(fs, path);
      } else {
        fs.unlinkSync(path);
      }
    })
  }
}