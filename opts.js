var path = require('path');

/**
 * Общий данные для сборщиков
 */
module.exports = {
    path: {
        root: __dirname,
        src: path.resolve(__dirname, './src'),
        node_modules: path.resolve(__dirname, './node_modules'),
        styles: path.resolve(__dirname, './src/styles'),
        relative_components: './src/components',
        components: path.resolve(__dirname, './src/components'),
        output: path.resolve(__dirname, './dist'),
        public: '/',
        js_entry: path.resolve(__dirname, './src/index.js'),
    },
    js_filename: 'bundle.js',
    styles_filename: 'bundle.css',
};