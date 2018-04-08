var webpack = require('webpack');
var path = require('path');

var parentDir = path.join(__dirname, '../');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry: [
		path.join(parentDir, 'index.js')
    ],
    output: {
        path: parentDir + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true,
        overlay: true
    },
	module: {
		loaders: [{
			    test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},{
                test: /\.css$/,
				loaders: ["style-loader", "css-loader", "less-loader"]
			}
		]
    },
    plugins: [
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
}