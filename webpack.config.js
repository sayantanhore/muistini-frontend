module.exports = require('./webpack.dev.config.js');
if (process.env.NODE_ENV === 'DEV') {
  module.exports = require('./webpack.dev.config.js');
}
else if (process.env.NODE_ENV === 'PROD') {
  module.exports = require('./webpack.prod.config.js');
}
