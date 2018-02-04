var path = require('path')

module.exports = opts => {
    return {
        entry: ['babel-polyfill', opts.path.js_entry],
        output: {
            filename: opts.js_filename,
            path: opts.path.output,
            publicPath: opts.path.public
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                components: opts.path.components,
            },
        },
        module: {
            rules: [{
                test: /\.jsx?$/,
                include: [
                    opts.path.src
                ],
                exclude: [
                    opts.path.node_modules
                ],
                loader: "babel-loader",
            }]
        }
    };
}