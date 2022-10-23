const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TestPlugin = require('./plugins/test-plugin');
const BannerWebpackPlugin = require('./plugins/banner-webpack-plugin');
const CleanWebpackPlugin = require('./plugins/clean-webpack-plugin');
const AnalyzeWebpackPlugin = require('./plugins/analyze-webpack-plugin');
const InlineChunkWebpackPlugin = require('./plugins/inline-chunk-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    // clean: true
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   loader: './loaders/test-loader.js'
      // }
      {
        test: /\.js$/,
        // use: ['./loaders/demo/test2','./loaders/demo/test1']
        // loader: './loaders/demo/test3'
        // use: ['./loaders/demo/test4', './loaders/demo/test5', './loaders/demo/test6']
        // loader: './loaders/clean-log-loader',
        // loader: './loaders/banner-loader',
        // options: {
        //   author: '弯月'
        // }
        // loader: './loaders/babel-loader',
        // options: {
        //   presets: ['@babel/preset-env']
        // }
      },
      {
        test: /\.(jpe?g|webp|gif|png)$/,
        use: './loaders/file-loader',
        type: 'javascript/auto' // 阻止webpack默认处理图片资源，只使用file-loader处理
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          './loaders/style-loader',
          'css-loader',
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    // new TestPlugin(),
    new BannerWebpackPlugin({author: '弯月'}),
    new CleanWebpackPlugin(),
    new AnalyzeWebpackPlugin(),
    new InlineChunkWebpackPlugin([/runtime(.*)\.js$/g])
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  mode: 'production'
}