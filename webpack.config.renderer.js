const path = require('path');

module.exports = {
	entry: { main: './src/renderer.js' },
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'renderer.js'
	},
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

