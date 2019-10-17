const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    contentBase: './dist',
    port: 3001,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        include: /src/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                webpackImporter: false,
                includePaths: ['./src/styles'],
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: "./static/index.html"
    }),
    new CopyPlugin([
      { from: 'static' },
    ])
  ]
};