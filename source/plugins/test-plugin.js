const { compilation } = require("webpack");

/*
 1. webpack加载webpack.config.js中所有配置，此时会new TestPlugin()，执行插件的constructor
 2. webpack创建compiler对象
 3. 遍历plugins中所有的插件，调用插件的apply方法
 4. 执行剩下的编译流程（触发各个hook事件） 
*/
module.exports = class TestPlugin {
  constructor() {
    console.log('TestPlugin construct');
  }

  apply(compiler) {
    debugger;
    console.log(compiler);
    console.log('TestPlugin apply');
    // environment在编译器准备环境时调用，时机在配置文件初始化插件后
    compiler.hooks.environment.tap('TestPlugin', () => {
      console.log('TestPlugin environment')
    });

    // emit 输出asset到output目录之前执行  异步串行
    compiler.hooks.emit.tap('TestPlugin', (compilation) => {
      console.log(compilation);
      console.log('TestPlugin emit 111');
    });

    compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('TestPlugin emit 222');
        callback();
      }, 2000);
    });

    compiler.hooks.emit.tapPromise('TestPlugin', (compilation) => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log('TestPlugin emit 333')
          resolve();
        }, 1000);
      });
    });

    // make compilation创建 异步并行
    compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('TestPlugin make 111');
        compilation.hooks.seal.tap('TestPlugin', () => {
          console.log('TestPlugin seal');
        })
        callback();
      }, 3000);
    });
    compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('TestPlugin make 222');
        callback();
      }, 1000);
    });
    compiler.hooks.make.tapAsync('TestPlugin', (compilation, callback) => {
      setTimeout(() => {
        console.log('TestPlugin make 333');
        callback();
      }, 2000);
    });
  }
};