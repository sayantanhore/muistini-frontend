const webpackTestConfig = require('./webpack.test.config.js');

module.exports = (config) => {
  config.set({
    framewroks: [
      'jasmine'
    ],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher'
    ],
    preprocessors: {
      './karma.test.shim.js': ['webpack']
    },
    webpack: webpackTestConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    webpackServer: {
      noInfo: true
    },
    files: [{
      pattern: './karma.test.shim.js',
      watched: false
    }],
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    reporters: ['progress'],
    browsers: ['Chrome'],
    colors: true
  })
}
