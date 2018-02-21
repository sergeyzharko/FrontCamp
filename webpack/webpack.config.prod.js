var path = require('path');
var webpack = require('webpack')

module.exports = {
    context: path.resolve(__dirname,"app"), // __dirname - текущая папка, корневой модуль
    entry: "./main", // корневой элемент
    output: {
        path: path.resolve(__dirname,"dist"), // все сформированные ассеты
        filename: "bundle.js"
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
    devtool: "source-map", // для PROD, собирается медленно
    watch: true, // пересборка после изменений
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
    },
    plugins: [
        new webpack.DefinePlugin({
            ENVIRONMENT: "production"
        })
    ]
}