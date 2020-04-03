const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: path.resolve('src', 'main.jsx'),

	module: {
		rules: [{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader'
					},
					{
						loader: 'sass-loader'
					}
				]
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [{
					loader: "file-loader",
					options: {
						name: "[name].[ext]",
						outputPath: "fonts",
						publicPath: "../fonts" // Added to fix paths to fonts in luigi-css. It's possible that it's not the best solution.
					}
				}]
			}
		]
	},

	output: {
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[chunkhash].js'
	},

	mode: 'development',
	target: 'web',
	plugins: [
		new CleanWebpackPlugin(),
		new webpack.ProvidePlugin({
			"React": "react",
			'firebase': 'firebase'
		}),
		new UglifyJSPlugin(),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, 'src', 'index.html')
		}),
		new MiniCssExtractPlugin({
			filename: "static/[name].[contenthash].css"
		}),
		new CopyPlugin([{
			from: '*.html',
			context: 'src'
		}], {
      copyUnmodified: true //fixes conflict with clean webpack plugin https://github.com/webpack-contrib/copy-webpack-plugin/issues/261#issuecomment-552550859
    })
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	}
};
