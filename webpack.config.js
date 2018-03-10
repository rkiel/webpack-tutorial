const path = require('path');

module.exports = {
  entry: {
    hello: './src/hello.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
};
