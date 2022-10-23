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
// 开发模式 引入js热加载插件
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 获取cross-env定义的环境变量
const isProduction = process.env.NODE_ENV === 'production';

const getStyleLoader = (pre) => {
  return [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
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
    pre && {
      loader: pre,
      options: pre === 'less-loader'
        ? {
          // antd自定义主题配置
          lessOptions: {
            modifyVars: {'@primary-color': '#1DA57A'},
            javascriptEnabled: true
          }
        }
        : {}
    }
  ].filter(Boolean);
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: isProduction ? path.resolve(__dirname, '../dist') : undefined,
    // 为了更好的做缓存
    filename: isProduction
      ? 'static/js/[name].[contenthash:10].js'
      : 'static/js/[name].js',
    chunkFilename: isProduction
      ? 'static/js/[name].[contenthash:10].chunk.js'
      : 'static/js/[name].chunk.js',
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
          plugins: [
            !isProduction && 'react-refresh/babel', // 激活js的HMR
          ].filter(Boolean)
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
    isProduction &&
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:10].css',
      chunkFilename: 'static/css/[name].[contenthash:10].chunk.css'
    }),
    !isProduction && new ReactRefreshWebpackPlugin(),
    isProduction && new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "../public"),
          to: path.resolve(__dirname, "../dist"),
          // toType: "dir",
          // noErrorOnMissing: true, // 不生成错误
          globOptions: {
            // 忽略文件
            ignore: ["**/index.html"],
          },
        }
      ]
    }),
  ].filter(Boolean),
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // react react-dom react-router-dom 打包成一个文件
        react: {
          test: /node_modules[\/\\]react(.*)?/,
          name: 'chunk-react',
          priority: 40
        },
        // antd单独打包
        antd: {
          test: /node_modules[\/\\]antd(.*)?/,
          name: 'chunk-antd',
          priority: 30
        },
        // 剩下的node_modules一起打包
        lib: {
          test: /node_modules[\/\\]/,
          name: 'chunk-lib',
          priority: 20
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `chunk~${entrypoint.name}.js`,
    },
    // 是否需要进行压缩
    minimize: isProduction,
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
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true, // 解决前端路由刷新404问题
  },
  performance: false, // 关闭性能分析，提升打包速度
}