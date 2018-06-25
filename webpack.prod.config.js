const webpack = require('webpack');
const uglifyJSPlugin = webpack.optimize.UglifyJsPlugin;
const autoprefixer = require('autoprefixer');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: 'main'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    modules: ['./src', './node_modules']
  },
  output: {
    path: __dirname + '/dist',
    filename: './js/[name].js'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './tsconfig.json'
        }
      }, 'angular2-template-loader'],
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.scss$/,
      use: extractTextWebpackPlugin.extract([{
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: [
            autoprefixer({browsers: ['last 2 versions', 'ie > 9']})
          ]
        }
      }, {
        loader: 'sass-loader'
      }])
    }]
  },
  plugins: [
    new uglifyJSPlugin({
      compress: {
        warnings: false
      }
    }),
    new extractTextWebpackPlugin({
      filename: './css/[name].css'
    })
  ]
}
