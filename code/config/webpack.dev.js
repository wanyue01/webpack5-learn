const path = require('path');
const os = require('os');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const threads = os.cpus().length;

module.exports = {
  // 入口
  entry: "./src/main.js",  // 相对路径
  // 输出
  output: {
    // 文件的输出路径
    // 开发模式没有输出
    path: undefined,
    // 文件名
    filename: 'static/js/main.js',
    // 自动清空上次打包的内容
    clean: true
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        // 每个文件只使用一种loader
        oneOf: [
          {
            test: /\.css$/,  // 只检测.css文件
            use: [
              // 执行顺序：从下到上
              // 'style-loader',  // 将js中的css通过创建style标签的形式添加到html中
              MiniCssExtractPlugin.loader,
              'css-loader',  // 将css资源编译成commonjs的模块到js中
            ]
          },
          {
            test: /\.less$/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader'
            ]
          },
          {
            test: /\.s[ac]ss$/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader'
            ]
          },
          {
            test: /\.styl$/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              'stylus-loader',  // 将stylus编译成css文件
            ]
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            // asset/resource 代表不用转base64
            parser: {
              dataUrlCondition: {
                // 小于10kb的图片转base64
                // 优点：减少请求数量  缺点：体积更大
                maxSize: 10 * 1024,  // 10kb
              }
            },
            generator: {
              // [hash:10] hash值取前10位
              filename: 'static/images/[hash:10][ext][query]'
            }
          },
          {
            test: /\.m?js$/,
            // exclude: /node_modules/, // 排除node_modules下的文件，其他文件都处理
            include: path.resolve(__dirname, '../src'), // 只处理src下的文件，其他文件都不处理
            use: [
              {
                loader: 'thread-loader',
                options: {
                  works: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存文件压缩，因为上线后并不需要缓存文件，体积并不关心
                  plugins: ['@babel/plugin-transform-runtime'], // 减少代码体积
                },
              }
            ]
            // use: {
            //   loader: 'babel-loader',
            //   options: {
            //     presets: ['@babel/preset-env']
            //   }
            // }
          }
        ]
      }
    ]
  },
  // 插件
  plugins: [
    // plugin的配置
    new ESLintPlugin({
      // 检查哪些文件
      context: path.resolve(__dirname, '../src'),
      exclude: 'node_modules',
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache'),
      threads
    }),
    new HtmlWebpackPlugin({
      // 模板：以public/index.html文件创建新的html文件
      // 新的html文件特点：1.结构和原来一致 2.自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin()
  ],
  // 开发服务器 不会输出资源，在内存中编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR（默认值）
  },
  // 模式
  mode: 'development',
  // 映射，如果出错容易发现错误在哪
  devtool: "cheap-module-source-map"
}