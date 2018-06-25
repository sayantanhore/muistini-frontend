const htmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: 'main'
  },
  resolve: {
    extensions: ['.ts', '.js', '.scss'],
    modules: ['./src', './node_modules']
  },
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true
  },
  output: {
    path: __dirname + '/dist',
    filename: './js/[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.ico$/,
      loaders: [{
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: __dirname + '/dist'
        }
      }]
    }, {
      test: /\.ts$/,
      loader: 'tslint-loader',
      enforce: 'pre',
      options: {
        tsConfigFile: 'tsconfig.json',
        emitErrors: false,
        configFile: 'tslintconfig.json'
      }
    }, {
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
      loaders: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader',
        options: {
          sourceMap: true
        }
      }, {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          plugins: [
            autoprefixer({ browsers: ['last 2 versions', 'ie > 9'] })
          ]
        }
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: ['./src']
        }
      }]
    }]
  },
  plugins: [new htmlWebpackPlugin({
    template: './index.html'
  }), new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, '/src'),
      {}
  )]
}
