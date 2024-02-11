const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    // 通过 context 可以更改上下文
    // context: path.resolve(__dirname, 'src'),
    // entry: ['./src/index.js', './src/test.js'],
    entry: {
        app: {
            import: './src/index.js', // 入口文件, 即 启动时需加载的模块。
            filename: 'app.js', // 指定要输出的文件名称。
            dependOn: ['react-vendor'], // 依赖, 当前入口所依赖的入口。它们必须在该入口被加载前被加载。
        },
        'react-vendor': {
            import: ['react', 'redux'], // 入口文件, 即 启动时需加载的模块。
            filename: 'react-vendor.js', // 指定要输出的文件名称。
            // dependOn: '', // 依赖, 当前入口所依赖的入口。它们必须在该入口被加载前被加载。
        },
        test: {
            import: './src/test.js', // 入口文件, 即 启动时需加载的模块。
            filename: 'appTest.js', // 指定要输出的文件名称。
            // dependOn: '', // 依赖, 当前入口所依赖的入口。它们必须在该入口被加载前被加载。
        }
    },
    // output default dist
    output: {
        filename: '[name].bundle.js', // 输出文件的名称
        path: path.resolve(__dirname, '../dist'), // 输出文件所在的目录
        publicPath: 'http://cdn.example.com/ernest/', // 为所有资源指定一个基础路径, 会在所有资源前面加上这个路径
        assetModuleFilename: 'images/[hash][ext][query]',
        chunkFilename: '[name].bundle.js', // 非入口(non-entry) chunk 文件的名称
        // [name] 文件原本的名称
        // [id] 模块的 id
        // [file] 原始路径，带文件名，带后缀。
        // [base] 文件名字 + 后缀。例如，如果文件是 ./path/c.png，[base] 将是 c.png。
        // [path] 文件的相对路径名。
        library: {
            name: 'MyLibrary', // 导出库的名称
            type: 'umd', // 导出库的类型. e.g. var, module, assign, cmd, umd, require
            // export: '', // 指定哪个导出的值是库的导出值
            auxiliaryComment: 'Test Comment', // 在 UMD 构建中添加注释
            umdNamedDefine: true, // 在 UMD 模式下是否使用 define 
        }
    },
    // mode: 'production', // 模式, 有 development, production, none. 和 --mode 选项一样
    module: {
        rules: [{
            test: /\.css$/i, // 正则表达式，用于匹配文件
            use: [MiniCssExtractPlugin.loader, "css-loader"], // 应用于模块的 loader 使用列表
        }, {
            test: /\.scss$/i, // 正则表达式，用于匹配文件
            use: ["style-loader", "css-loader", "sass-loader"], // 应用于模块的 loader 使用列表
        }, {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            // 用于处理文件的类型. 有 4 种类型：asset, asset/source, asset/inline, asset/resource
            // type: 'asset/resource', // 生成一个单独的文件并导出 URL。之前通过 file-loader 实现
            // type: 'asset/inline', // 以 base64 编码, 内联到代码中。之前通过 url-loader 实现
            // type: 'asset/source', // 以原始文件的形式导出。之前通过 raw-loader 实现
            type: 'asset',
            generator: {
                filename: 'images/[hash][ext]', // 指定要输出的文件名称
            },
            parser: {
                dataUrlCondition: { // 用于配置哪些文件应该被处理为 Data URL
                    maxSize: 4 * 1024, // 4kb, 文件大小小于 4kb 时处理以 base64 编码内联到代码中，否则生成单独文件
                }
            },
        },]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Ernest App', // 生成的 HTML 文件的标题
            filename: 'app.html', // 生成的 HTML 文件的名称. 默认为 index.html
            template: path.resolve(__dirname, '../src/index.html'), // 模板文件的路径. 指定一个模板文件
            templateParameters: { // 替换模板文件中的变量
                titleName: 'Ernest App', // 会去替换模板文件中的 <%= htmlWebpackPlugin.options.titleName %>
            },
            publicPath: 'http://cdn.example.com/ernest/', // 为所有资源指定一个基础路径, 会在所有资源前面加上这个路径. 其实是 S3 或者 CDN 的路径
            minify: { // 压缩 HTML 文件. 传递 false 来禁用。
                removeComments: true, // 删除注释
                collapseWhitespace: true, // 折叠空白
                removeRedundantAttributes: true, // 删除冗余属性
                useShortDoctype: true, // 使用短的文档类型
                removeEmptyAttributes: true, // 删除空属性
                removeStyleLinkTypeAttributes: true, // 删除 style 和 link 标签的 type 属性
                keepClosingSlash: true, // 保持尾部斜线
                minifyJS: true, // 压缩 JS
                minifyCSS: true, // 压缩 CSS
                minifyURLs: true, // 压缩 URL
            },
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[name].css', // 异步加载的模块
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CSSMinimizerPlugin({
                test: /\.css$/i, // 正则表达式，用于匹配 loader 输出的文件，不是原始文件
                // include: /\/includes/, // 包含的文件
                exclude: /node_modules/, // 排除的文件
                parallel: true, // 是否并行处理. 默认是 true
                minify: CSSMinimizerPlugin.cleanCssMinify, // 自定义压缩器. 有 5 种内置压缩器：cssnanoMinify, cleanCssMinify, cssoMinify, esbuildMinify, parallelCssMinify
                minimizerOptions: { // 传递给压缩器的选项
                },
            }),
        ],
    },
    devtool: 'source-map', // 生成 source map
    // devtool: 'nosources-source-map', // 生成 source map
}