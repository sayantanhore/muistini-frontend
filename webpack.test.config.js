module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './tsconfig.json'
        }
      }],
      exclude: /node_modules/
    }]
  }
}
