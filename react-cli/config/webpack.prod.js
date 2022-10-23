const path = require('path');
const EslintWepackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 将css提取成单独文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// 压缩js
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const getStyleLoader = (pre) => {
  return [
    MiniCssExtractPlugin.loader,
    'css-loader',
    {
      // 处理css兼容性问题
      // 配合package.json中的browserslist指明兼容到什么程度
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'postcss-preset-env'
          ]
        }
      }
    },
    pre
  ].filter(Boolean);
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // 为了更好的做缓存
    filename: 'static/js/[name].[contenthash:10].js',
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
    clean: true
  },
  module: {
    rules: [
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoader()
      },
      {
        test: /\.less$/,
        use: getStyleLoader('less-loader')

      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoader('sass-loader')
      },
      {
        test: /\.styl$/,
        use: getStyleLoader('stylus-loader')
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|webp|gif|svg)/,
        // 小于一定大小就转base64
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb都转为base64
          }
        }
      },
      // 处理其他资源，如字体图标等
      {
        test: /\.(woff2?|ttf)/,
        type: 'asset/resource',
      },
      // 处理js
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        }
      }
    ]
  },
  plugins: [
    new EslintWepackPlugin({
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true,
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:10].css',
      chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          globOptions: {
            // 忽略index.html文件
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ],
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `chunk~${entrypoint.name}.js`,
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  },
  // webpack解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: ['.jsx', '.js', '.json']
  },
}