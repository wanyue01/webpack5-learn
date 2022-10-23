const path = require('path');
const os = require('os');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const threads = os.cpus().length; // cpu核数

function getStyleLoader(pre) {
  return [
    // 执行顺序：从下到上
    // 'style-loader',  // 将js中的css通过创建style标签的形式添加到html中
    // CssMinimizerPlugin.loader,
    MiniCssExtractPlugin.loader, // 把css抽离成一个文件
    'css-loader',  // 将css资源编译成commonjs的模块到js中
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env',
            ],
          ],
        },
      },
    },
    pre
  ].filter(x => x);
}

module.exports = {
  // 入口
  entry: "./src/main.js",  // 相对路径
  // 输出
  output: {
    // 文件的输出路径
    // __dirname 当前文件的文件夹目录
    path: path.resolve(__dirname, '../dist'),  // 绝对路径
    // 文件名
    filename: 'static/js/[name].js',
    // 给打包输出的其他文件命名
    chunkFilename: 'static/js/[name].js',
    // 图片、字体等通过type:asset处理资源命名方式
    assetModuleFilename: 'static/media/[hash:10][ext][query]',
    // 自动清空上次打包的内容
    clean: true
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        oneOf: [
          {
            test: /\.css$/,  // 只检测.css文件
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
            // generator: {
            //   // [hash:10] hash值取前10位
            //   filename: 'static/images/[hash:10][ext][query]'
            // }
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  works: threads
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  cacheDirectory: true, // 开启babel缓存
                  cacheCompression: false, // 关闭缓存文件压缩
                  plugins: ['@babel/plugin-transform-runtime'], // 减少代码体积
                }
              }
            ]
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
      threads, // 开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      // 模板：以public/index.html文件创建新的html文件
      // 新的html文件特点：1.结构和原来一致 2.自动引入打包输出的资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css'
    }),

  ],
  optimization: {
    // 压缩的操作
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: threads, // 开启多进程和设置进程数量
      })
    ],
    splitChunks: {
      chunks: 'all',
      // 其他都用默认值
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  // 模式
  mode: 'production',
  devtool: 'source-map'
}