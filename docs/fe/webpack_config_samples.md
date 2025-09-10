

# webpack配置文件示例

## 配置文件详细标注

```ts
// webpack.config.ts  示例
import path from 'path';
import { Configuration } from 'webpack';

// 生成HTML文件并注入打包后的资源
import HtmlWebpackPlugin from 'html-webpack-plugin';

// 提取CSS为独立文件（替代style-loader，性能更优）
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// 压缩CSS代码
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// 压缩JS代码（webpack5内置，但需显式配置以自定义选项）
import TerserPlugin from 'terser-webpack-plugin';

// 图片压缩插件
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

// 移除未使用的CSS代码
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin';

// 用于匹配文件路径
import glob from 'glob';

// 可视化打包体积分析工具
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const config: Configuration = {
  // 1. 模式：生产环境（自动启用优化）
  mode: 'production',
  // 2. 入口文件：项目入口点
  entry: './src/index.ts',
  // 3. 输出配置
  output: {
    // 输出目录（绝对路径）
    path: path.resolve(__dirname, 'dist'),
    // 文件名：[name] chunk名称，[contenthash] 内容哈希（用于长效缓存）
    filename: '[name].[contenthash].js',
    // 每次构建前清空dist目录
    clean: true,
    // 静态资源（图片、字体等）输出路径
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  // 4. 解析配置
  resolve: {
    // 自动解析的扩展名（导入时可省略）
    extensions: ['.ts', '.js', '.json', '.less'],
    // 路径别名（简化导入路径）
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    // 模块查找目录（优先查找项目内node_modules）
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  // 5. 模块处理规则
  module: {
    rules: [
      // 5.1 TypeScript/JavaScript处理
      {
        test: /\.ts$/,
        use: [
          // 多线程处理（提升构建速度）
          'thread-loader',
          // Babel转译（处理ES6+语法）
          'babel-loader',
          // TypeScript转译
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,  // 仅转译，不做类型检查，提升速度
              happyPackMode: true
            }
          }
        ],
        // 排除node_modules
        exclude: /node_modules/
      },
      // 5.2 Less/CSS处理
      {
        test: /\.less$/,
        use: [
          // 提取CSS为独立文件
          MiniCssExtractPlugin.loader,
          // 解析CSS文件（处理@import和url()）
          'css-loader',
          // 自动添加浏览器前缀（需配合autoprefixer）
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          // 编译Less为CSS
          'less-loader'
        ]
      },
      // 5.3 图片资源处理
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // webpack5内置Asset模块（替代file-loader/url-loader）
        type: 'asset',
        parser: {
          // 小于8kb的图片转为base64（减少HTTP请求）
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        },
        generator: {
          // 图片输出路径
          filename: 'images/[hash][ext]'
        }
      }
    ]
  },
  // 6. 插件配置
  plugins: [
    // 6.1 生成HTML文件
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板文件
      minify: {
        collapseWhitespace: true, // 压缩HTML空格
        removeComments: true, // 移除注释
        removeRedundantAttributes: true, // 移除冗余属性
        removeScriptTypeAttributes: true, // 移除script标签type属性
        removeStyleLinkTypeAttributes: true, // 移除link标签type属性
        useShortDoctype: true // 使用短文档类型声明
      }
    }),
    // 6.2 提取CSS文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css' // CSS文件名（带内容哈希）
    }),
    // 6.3 移除未使用CSS
    new PurgeCSSPlugin({
      // 扫描src目录下的所有文件，匹配使用的CSS类
      paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`, { nodir: true })
    }),
    // 6.4 打包体积分析（默认不打开浏览器）
    new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: false })
  ],
  // 7. 优化配置
  optimization: {
    // 7.1 压缩工具
    minimizer: [
      // 压缩JS
      new TerserPlugin({
        parallel: true, // 多线程压缩
        terserOptions: {
          compress: {
            drop_console: true // 移除console.log
          }
        }
      }),
      // 压缩CSS
      new CssMinimizerPlugin(),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            encodeOptions: {
              mozjpeg: { quality: 80 }, // JPEG压缩质量
              webp: { lossless: 1 }, // WebP无损压缩
              avif: { cqLevel: 0 } // AVIF压缩级别
            }
          }
        }
      })
    ],
    // 7.2 代码分割
    splitChunks: {
      chunks: 'all', // 分割所有类型的chunk
      cacheGroups: {
        // 提取第三方库（如react、lodash）
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        // 提取CSS（确保CSS单独分割）
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
    // 7.3 运行时chunk（避免每次构建改变hash）
    runtimeChunk: 'single',
    // 7.4 只导出使用过的模块（Tree Shaking）
    usedExports: true,
    // 7.5 模块合并（提升运行时性能）
    concatenateModules: true
  },
  // 8. 缓存配置（提升二次构建速度）
  cache: {
    type: 'filesystem', // 文件系统缓存
    buildDependencies: {
      config: [__filename] // 配置文件变化时重新缓存
    }
  },
  // 9. 日志级别（只输出错误信息）
  stats: 'errors-only'
};

export default config;
```

## react企业级配置示例

```ts
// react企业级别配置示例
import path from 'path';
import { Configuration, DefinePlugin, BannerPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import CopyPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

// 基础配置（多环境共享）
const baseConfig: Configuration = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  module: {
    rules: [
      // TypeScript/JavaScript 处理
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
      // Less 处理（支持 CSS Modules 和主题变量）
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: (resourcePath: string) => resourcePath.includes('components'),
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 2,
            },
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: {
                  '@primary-color': '#1890ff', // 企业级主题定制
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      // 图片优化
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024, // 2KB 以下内联
          },
        },
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      // 字体和其他资源
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: process.env.NODE_ENV === 'production',
        removeComments: process.env.NODE_ENV === 'production',
      },
      chunksSortMode: 'auto',
    }),
    new Dotenv({
      path: path.resolve(__dirname, `.env.${process.env.NODE_ENV || 'development'}`),
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30 * 1024, // 30KB 以上才分割
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          reuseExistingChunk: true,
        },
        common: {
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        // 提取 React 相关库为单独 chunk
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendor',
          priority: -5,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
    minimizer: [
      // 仅生产环境启用
      process.env.NODE_ENV === 'production' && new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // 移除 console
            drop_debugger: true,
          },
        },
      }),
    ].filter(Boolean),
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  stats: 'errors-warnings',
};

// 开发环境配置
const devConfig: Configuration = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: path.resolve(__dirname, 'public'),
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
    client: {
      overlay: true,
      progress: true,
    },
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
      },
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
};

// 生产环境配置
const prodConfig: Configuration = {
  mode: 'production',
  devtool: 'hidden-source-map',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: path.resolve(__dirname, 'dist'),
          globOptions: {
            ignore: ['**/*.html'],
          },
        },
      ],
    }),
    // 构建分析（按需启用）
    process.env.ANALYZE === 'true' && new BundleAnalyzerPlugin(),
    new BannerPlugin({
      banner: `Build Date: ${new Date().toISOString()}\nVersion: ${process.env.VERSION || 'unknown'}`,
    }),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.squooshMinify,
          options: {
            encodeOptions: {
              mozjpeg: { quality: 80 },
              webp: { lossless: 1 },
              avif: { cqLevel: 0 },
            },
          },
        },
      }),
    ],
  },
};

// 根据环境合并配置
export default (env: Record<string, string>) => {
  process.env.NODE_ENV = env.NODE_ENV || 'development';
  return merge(baseConfig, process.env.NODE_ENV === 'production' ? prodConfig : devConfig);
};
```

## babel配置文件示例

```json
// babel.config.json
{
  "presets": [
    [
      // 预设1：处理ES6+语法（根据目标浏览器自动转换）
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not dead", "not ie <= 11"]
        },
        "useBuiltIns": "usage",  // 自动导入polyfill（按需加载）
        "corejs": 3,   // 指定corejs版本
        "modules": false
      }
    ],
    // 预设3（可选）：处理React（如果使用React）
    [
      "@babel/preset-react",
      {
        "runtime": "automatic",
        "importSource": "react"
      }
    ],
    // 预设3：处理TypeScript
    "@babel/preset-typescript",
    "@babel/preset-flow"
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3,
        "helpers": true,
        "regenerator": true
      }
    ],
     // 插件1：支持类属性（如class A { #privateField; }）
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-private-methods",
    "@babel/plugin-syntax-dynamic-import",
    // 开发环境热更新
    process.env.NODE_ENV === "development" && "react-refresh/babel"
  ].filter(Boolean),
  "env": {
    "test": {
      "presets": [
        ["@babel/preset-env", { "targets": { "node": "current" } }]
      ]
    }
  }
}
```

## 依赖说明

```shell
# 核心依赖
npm install webpack webpack-cli webpack-dev-server webpack-merge typescript @types/webpack @types/webpack-dev-server -D

# Babel 相关
npm install @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript @babel/plugin-transform-runtime babel-loader core-js -D

# 样式处理
npm install less less-loader css-loader style-loader postcss-loader postcss-preset-env mini-css-extract-plugin css-minimizer-webpack-plugin -D

# 资源处理
npm install html-webpack-plugin image-minimizer-webpack-plugin copy-webpack-plugin dotenv-webpack -D

# React 相关（如使用 React）
npm install react-refresh-webpack-plugin @pmmmwh/react-refresh-webpack-plugin -D
```

## 关键企业级特性说明

| 配置项             | 核心实现                                                     | 企业级价值                                                   | 适用场景                      |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------- |
| **多环境配置**     | 通过 `NODE_ENV` 变量区分环境，结合 `webpack-merge` 拆分配置文件 | 1. 避免开发/生产配置冲突<br>2. 统一环境变量管理<br>3. 降低部署错误风险 | 全场景（必备基础配置）        |
| **精细化代码分割** | `splitChunks` 按优先级拆分：<br>- vendors: 第三方库<br>- react-vendor: React 生态<br>- common: 共享业务组件 | 1. 第三方库代码独立缓存<br>2. 业务代码变更不影响库缓存<br>3. 并行加载提升首屏速度 | 大型应用（代码量 > 100KB）    |
| **文件系统缓存**   | `cache: { type: 'filesystem', buildDependencies: { config: [__filename] } }` | 1. 二次构建速度提升 70%+<br>2. CI/CD 构建效率优化<br>3. 减少重复编译资源消耗 | 开发环境（提升迭代效率）      |
| **资源预加载**     | `HtmlWebpackPlugin` + `preload-webpack-plugin` 自动注入 `<link rel="preload">` | 1. 关键资源优先加载<br>2. 减少渲染阻塞时间<br>3. LCP 指标优化 30%+ | 首屏关键资源（JS/CSS/字体）   |
| **CSS Modules**    | `css-loader` 配置 `modules: { auto: true, localIdentName: '[name]__[local]--[hash:base64:5]' }` | 1. 样式完全隔离<br>2. 避免团队样式冲突<br>3. 支持主题动态切换 | 中大型 React/Vue 项目         |
| **环境变量管理**   | `dotenv-webpack` 加载多环境文件：`.env.development` / `.env.production` / `.env.secret` | 1. API 密钥不硬编码<br>2. 符合企业安全规范<br>3. 环境配置可追溯 | 包含敏感信息的生产环境        |
| **构建分析**       | `BundleAnalyzerPlugin` + `speed-measure-webpack-plugin` 双维度分析 | 1. 可视化依赖体积分布<br>2. 识别冗余依赖（如 lodash 全量引入）<br>3. 量化优化效果 | 构建体积优化 / 性能瓶颈排查   |
| **Tree Shaking**   | `mode: 'production'` + ES Module + `sideEffects: false` 标记纯模块 | 1. 移除 30%+ 未使用代码<br>2. 配合 `babel-plugin-import` 实现按需加载 | 使用 ES Module 的现代前端项目 |
| **图片优化流水线** | `image-minimizer-webpack-plugin` + `squoosh` 多格式转换      | 1. 自动生成 WebP/AVIF<br>2. 图片体积减少 60%+<br>3. 支持响应式图片加载 | 电商 / 营销类网站             |
| **构建产物校验**   | `webpack-subresource-integrity` 生成 SRI 哈希                | 1. 防止 CDN 资源篡改<br>2. 符合企业安全审计要求<br>3. 提升应用完整性保障 | 生产环境静态资源部署          |
| **并行编译**       | `thread-loader` + `babel-loader?cacheDirectory`              | 1. 多核 CPU 利用率提升<br>2. 编译时间减少 40%+<br>3. 优化开发体验 | 代码量 > 500KB 的复杂项目     |
| **错误监控**       | `@sentry/webpack-plugin` 注入错误追踪代码                    | 1. 生产环境错误精准定位<br>2. 关联 Source Map<br>3. 提升问题解决效率 | 生产环境（用户关键路径）      |

## 企业级最佳实践补充

1. **配置拆分**：建议将 `webpack.config.ts` 拆分为 `config/base.ts`、`config/dev.ts`、`config/prod.ts` 维护
2. **CI/CD 集成**：通过 `process.env.VERSION` 注入构建版本号，便于追溯
3. **性能监控**：集成 `speed-measure-webpack-plugin` 监控 loader/plugin 耗时
4. **安全加固**：使用 `ContentSecurityPolicyPlugin` 设置 CSP 策略
5. **多入口支持**：复杂应用可扩展 `entry` 配置实现多页面构建

