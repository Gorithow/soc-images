const isDevBuild = process.argv.indexOf('--env.prod') < 0;
const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: { 'main-client': './ClientApp/main-client.ts' },
	resolve: { extensions: ['.js', '.ts'] },
	output: {
		filename: '[name].js',
		publicPath: '/dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
		path: path.join(__dirname, './wwwroot/dist')
	},
	module: {
		loaders: [
		{ test: /\.ts$/, include: /ClientApp/, loader: 'ts-loader', query: { silent: true } },
		{ test: /\.html$/, loader: 'raw-loader' },
		{ test: /\.css$/, loader: 'to-string-loader!css-loader' },
		{ test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader', query: { limit: 25000 } },
		{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
		{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
		]
	},
	devtool: isDevBuild ? 'inline-source-map' : false,
	plugins: [
	new webpack.DllReferencePlugin({
		context: __dirname,
		manifest: require('./wwwroot/dist/vendor-manifest.json')
	})
	].concat(isDevBuild ? [] : [
	new webpack.optimize.UglifyJsPlugin({
		compress: { warnings: false },
		mangle: true
	})
	])
};