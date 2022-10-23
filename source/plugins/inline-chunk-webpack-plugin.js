const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin');

module.exports = class InlineChunkWebpackPlugin {
  constructor(tests) {
    this.tests = tests;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineChunkWebpackPlugin', (compilation) => {
      // 1.获取html-webpack-plugin的hooks
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      // 2.注册html-webpack-plugin的hooks -> alterAssetTagGroups
      hooks.alterAssetTagGroups.tap('InlineChunkWebpackPlugin', assets => {
        // 3.在里面把script的runtime文件变成inline script
        assets.headTags = this.getInlineChunk(assets.headTags, compilation.assets);
        assets.bodyTags = this.getInlineChunk(assets.bodyTags, compilation.assets);
      }
      )
      hooks.afterEmit.tap('InlineChunkWebpackPlugin', () => {
        Reflect.ownKeys(compilation.assets).forEach(filepath => {
          if (this.tests.some(test => test.test(filepath))) {
            delete compilation.assets[filepath];
          }
        })
      })
    })
  }

  getInlineChunk(tags, assets) {
    /*
        目前：
          [
            {
              tagName: 'script',
              voidTag: false,   
              meta: { plugin: 'html-webpack-plugin' },
              attributes: { defer: true, type: undefined, src: 'js/chunk~main.js.js' }
            },
          ]
        目标：
          [
            {
              tagName: 'script', 
              innerHTML: runtime文件的内容,
              closeTag: true
            },
          ]
    */
    return tags.map(tag => {
      if (tag.tagName !== 'script') return tag;
      // 获取文件路径
      const path = tag.attributes.src;
      if (!path) return tag;
      if (!this.tests.some(test => test.test(path))) return tag;
      return {
        tagName: 'script',
        innerHTML: assets[path].source(),
        closeTag: true
      }
    })
  }
}