var webpack = require('webpack');
var path    = require('path');

module.exports = opts => {
    return {
        plugins: [
            // обновление файлов на лету
            new webpack.HotModuleReplacementPlugin(),
        ],
        devServer: {
            hot: true, 
            contentBase: opts.path.output,
            publicPath: opts.path.public
        },
        resolve: {
            modules: [path.basename(opts.path.node_modules), opts.path.components],
            alias: {
                src: opts.path.src,
            }
        }
    };
}