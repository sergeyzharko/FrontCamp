const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const package = require('../package.json');
const filelist = require('./filelist.js');
const customLoader = require('./customLoader.js');
var isProd;

module.exports = (env = {}) => {
    isProd = env === 'prod';
    let ret = {
        context: path.resolve(__dirname,"../app"), // __dirname - текущая папка, корневой модуль, используется для entry
        entry: {
            babel_polyfill: 'babel-polyfill', // name: path, to get async/await working
            main: "./scripts/main",
            vendor: Object.keys(package.dependencies), // подключение библиотек из package.json -> dependencies
            settings: "./scripts/settings"
        }, // корневой элемент
        output: {
            path: path.resolve(__dirname,"../dist"), // все сформированные ассеты
            //publicPath: 'dist/',
            filename: "[name].bundle.js", // вместо name будут подставлены названия из entry
            chunkFilename: '[name].bundle.js'
        },
        resolve: {
            // alias: { xyz: "/absolute/path/to/file.js" }, // require("xyz"); где искать модули, для сокращения путей
            mainFiles: ["index"], // дефолтный файл в импортируемой папке
            modules: ["web_modules", "node_modules"], // где искать модули без относительного пути
            extensions: [".js", ".jsx", ".json", ".scss"]
        },
        resolveLoader: { // для комплиляции
            modules: ["web_loaders", "web_modules", "node_modules"],
            extensions: [".js", ".json"]
        },
        devServer: { // the browser could refresh by itself, сборка происходит в памяти
            contentBase: path.join(__dirname, "../dist/"), // base folder
            port: 9000, // on what port the localhost server is to be spun
            hot: true, // без обновления страницы, hot module replacement
            inline: true
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    options: {
                        "presets": ["env"],
                        "plugins": [
                        //"./plugin.js", // выключать на DEV
                        "syntax-dynamic-import"
                        ]
                }
                },
                {
                    test: /\.(s*)css$/,
                    use: ExtractTextPlugin.extract({ // выделить CSS в отдельный файл
                        fallback:'style-loader', // 3) do the job of putting the css codes inside <style> tags in our index.html
                        use:[ // цепочка из нескольких лоадеров
                            {
                                loader: 'css-loader', // 2)
                                options: {}
                            },
                            {
                                loader: 'postcss-loader', // плагин PostCSS для добавления вендорных префиксов на основе данных сервиса Can I Use
                                options: {
                                    plugins: [
                                        autoprefixer({
                                            browsers:['ie >= 8', 'last 4 version']
                                        })
                                    ],
                                    sourceMap: true
                                }
                            },
                            {
                                loader: 'sass-loader', // 1) преобразование из sass в css
                                options: {}
                            }
                        ],
                    })
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,  
                    use: [{
                        loader: 'url-loader',
                        options: { 
                            limit: 20000, // Convert images < 20kb to base64 strings
                            name: isProd ? 'images/[name].[ext]' : 'images/[name]_[hash].[ext]'
                        } 
                    }]
                },
                {
                    test: /\.json$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {name: 'assets/[name].[ext]'}
                        },
                        {
                            loader: '../webpack/customLoader',
                        }
                    ]
                }
            ]
        },
        devtool: isProd ? "source-map" : "eval", // для DEV, собирается быстро
        // devtool: "source-map", // для PROD, собирается медленно
        // watch: true, // пересборка после изменений, when we added devServer, we don’t need to specify watch:true
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/
        },
        plugins: [
            // new webpack.EnvironmentPlugin({
            //     ENVIRONMENT: 'development'
            // }),
            new webpack.optimize.CommonsChunkPlugin({ // общие для всех модули. Выделяет общий код в отдельный файл.
                name: 'shared', // new file-name
                minChunks: Infinity // create a chunk if the module is found to be shared in at-least two other files/modules
            }),
            new HtmlWebpackPlugin({ // преобразование html
                hash: true, // add a unique hash to the src of the embedded <script> tag
                title: 'News API', // custom property
                template: 'index.html', // which file to use as template for the index.html being created
                chunks: ['babel_polyfill', 'vendor', 'shared', 'main'],
                filename: 'index.html' //relative to root of the application
            }),
            new HtmlWebpackPlugin({ // преобразование html
                hash: true, // add a unique hash to the src of the embedded <script> tag
                title: 'News API', // custom property
                template: 'index.html', // which file to use as template for the index.html being created
                chunks: ['babel_polyfill', 'vendor', 'shared', 'settings'],
                filename: 'settings.html' //relative to root of the application
            }),
            new ExtractTextPlugin({filename:'app.bundle.css'}),
            new CopyWebpackPlugin([ //  копирование файлов из начальной папки в конечную
                {from:'images',to:'images'} //, {from:'assets',to:'assets'} 
            ]),
            new webpack.NoEmitOnErrorsPlugin(), // при ошибке отменять сборку
            new filelist()
        ]
    }

    if (isProd) {
        ret.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
              compress: {
                // don't show unreachable variables etc
                warnings:     false,
                drop_console: true,
                unsafe:       true
              }
            })
        );
    }
    
    if (!isProd) {
        ret.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return ret;
}

