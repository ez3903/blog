# 构建工具

## webpack

### 概念

webpack是一个用于现代JavaScript应用程序的静态模块打包工具。

配置有哪些：

- entry：入口文件地址，可以是单个，也可以是多个
- output：输出的内容，path，filename，publicPath...
- module：loaders
- plugin：对打包流程的干预和增强
- resolve：别名，扩展名...
- externals：外部扩展
- devServer：port
- optimization：拆 chunk， cacheGroup
- stats
- context
- performance
- target
- mode

配置文件示例：

### 构建流程

#### 1. **初始化阶段（Initialization）**

- **配置合并**：解析`webpack.config.js`/`ts`与命令行参数，生成最终配置对象
- **Compiler实例化**：创建核心编译对象，注册内置+用户插件
- **环境准备**：确定Node.js运行环境，初始化默认参数

#### 2. **编译阶段（Compilation）**

- **入口解析**：从`entry`配置开始，递归处理所有依赖模块
- **依赖图构建**：通过`enhanced-resolve`解析路径，生成**Dependency Graph**
- 模块转换：
  - 匹配`module.rules`执行Loader链（如`less-loader`→`css-loader`→`MiniCssExtractPlugin.loader`）
  - 非JS资源（Less/图片）通过Loader转换为JS模块或Asset模块

#### 3. **Chunk生成阶段（Chunk Generation）**

- **模块分组**：根据依赖关系将模块分配到不同Chunk（入口文件生成初始Chunk）
- **代码分割**：应用`splitChunks`规则拆分公共代码（如`node_modules`提取为`vendors`Chunk）
- **运行时注入**：添加Webpack Runtime代码（负责Chunk加载与模块解析）

#### 4. **优化阶段（Optimization）**

- **Tree Shaking**：基于ES Module静态分析，移除未引用代码
- **模块合并**：`concatenateModules`将多个模块合并为单个函数（提升执行效率）
- 代码压缩：
  - JS：`TerserPlugin`压缩（空格/注释移除、变量混淆、死代码消除）
  - CSS：`CssMinimizerPlugin`压缩（规则合并、冗余移除）
- 资源优化：
  - 图片压缩：`ImageMinimizerPlugin`调用squoosh引擎
  - 无用CSS清理：`PurgeCSSPlugin`移除未使用样式

#### 5. **输出阶段（Emission）**

- 文件生成：根据`output`配置输出到`dist`目录：
  - JS文件：`[name].[contenthash].js`（内容哈希用于缓存）
  - CSS文件：`MiniCssExtractPlugin`提取为独立文件
  - 静态资源：图片/字体输出到指定目录
- **HTML处理**：`HtmlWebpackPlugin`注入JS/CSS资源到模板

#### 6. **完成阶段（Completion）**

- **构建结果反馈**：输出成功/失败状态及耗时统计
- **钩子触发**：执行`done`生命周期钩子（可用于部署通知）
- **缓存写入**：`filesystem`缓存中间结果，加速二次构建

#### 核心技术点

- **插件机制**：通过生命周期钩子（如`compiler.hooks.make`）扩展功能
- **Loader链执行**：从右到左依次处理文件（如`thread-loader`→`babel-loader`→`ts-loader`）
- **Chunk vs Bundle**：Chunk是内存中代码块，Bundle是最终输出文件（1个Chunk可生成多个Bundle）

### loader说明及常用loader

转换器，核心是解析。webpack没有loader的话，只能打包基础的cjs的js文件，对于css，静态资源是无法打包的，这时候就需要引入一些loader来进行文件的处理，更多的是文件的转换器。

+ thread-loader  多线程loader
+ babel-loader
+ vue-loader
+ ts-loader
+ style-loader
+ css-loader
+ less-loader/sass-loader
+ postcss-loader
  + autoprefixer
  + tailwindcss

+ file-loader/url-loader  ---- webpack5内置Asset模块（替代file-loader/url-loader）

### plugin说明及常用plugin

插件，主要是扩展webpack的功能，在webpack的运行周期里，会有一些hooks对外暴露，所以在webpack打包编译的过程中，plugin会根据这些hooks执行一些自定义的操作，来实现对输出结果的干预和增强

+ html-webpack-plugin：基于html模板，生成对应的文件和引用关系，构建运行时产物
+ mini-css-extract-plugin：将css抽成文件
+ css-minimizer-wepack-plugin：css压缩
+ terser-webpack-plugin：js压缩
+ uglify-js-webpack-plugin
+ define-webpack-plugin：them-> '#ff0000'
+ bundle-analyzer-webpack-plugin

### loader和plugin的区别

loader更专注于文件的转换，是转换器，让webpack处理非js模块，一般在固定的流程（打包文件之前）起作用

plugin更专注于流程的扩展，是扩展器，让输出资源的能力更丰富，在整个生命周期里，都起作用







