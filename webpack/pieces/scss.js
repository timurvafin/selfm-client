// позволяет сохранять bundle'ы в отдельные файлы
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var CSS_MODULES = false;

module.exports = opts => {
    const extractSass = new ExtractTextPlugin({
        filename: opts.styles_filename,
       // allChunks: true
        //filename: "[name].[contenthash].css",
        //disable: process.env.NODE_ENV === "development"
    });

    const rule = {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        url: false,
                        query: CSS_MODULES ? {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        } : {},
                    },
                },
                {
                    loader: "sass-loader",
                    options: {
                        includePaths: [opts.path.styles]
                    }
                }
            ],
            // use style-loader in development
            fallback: "style-loader"
        })
    };

    const alias = {
        styles: opts.path.styles,
    };

    return {
        resolve: {alias},
        module: {rules: [rule]},
        plugins: [extractSass]
    };
}