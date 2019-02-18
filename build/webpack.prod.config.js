const path = require("path");
const glob = require("glob");
const merge = require("webpack-merge");//配置合并
const baseWebpackConfig = require("./webpack.base.config")
const CleanWebpackPlugin = require("clean-webpack-plugin");//删除文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//css与js分离
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");//css压缩
const UglifyJsWebpackPlugin = require("uglifyjs-webpack-plugin");//js压缩
const Purify=require('purifycss-webpack');//css去重

let prodWebpackConfig = merge(baseWebpackConfig,{
	mode:'production',
	plugins:[
		new CleanWebpackPlugin(['public'],{//编译时，先删除打包文件
				root: path.resolve(__dirname, '..'),
				// 打印日志
				verbose: true,
				// 默认移除文件
				dry: false 
		}),
		new MiniCssExtractPlugin({//css分离
			filename: '[name]/css/[name].[hash].css',//文件位置，名字
			chunkFilename: '[id].[hash].css',
		}),
		new Purify({         //css优化去重去无效代码
	        	paths:glob.sync(path.join(__dirname,"src/views/*.html"))
	    })
	],
	module:{
		rules:[

			{
				test:/\.css$/,//处理css文件
			    use: [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader'],
				include:[path.resolve(__dirname,'../src/')]
			},
			{
				test:/\.(scss|sass)$/,//处理sass语言
			    use: [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader','sass-loader'],
				include:[path.resolve(__dirname,'../src/')]
			},
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
		        // 其次: 打包业务中公共代码
		        common: {
					name: "common",//提取出的模块名
					test: /\.js/,
					chunks: "initial",//表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
					minSize: 1,
					priority: 0
	       		},
			}
		},
	    minimizer: [
	      new UglifyJsWebpackPlugin({//压缩js
	        cache: true,
	        parallel: true,
	        // sourceMap: true // set to true if you want JS source maps
	      }),
	      new OptimizeCSSAssetsPlugin({//压缩css
				cssProcessor: require('cssnano'),//优化css，但不能去重
				cssProcessorPluginOptions: {//discardComments对注释的处理
					preset: ['default', { discardComments: { removeAll: true } }],
				},
				canPrint: true
	      })
	    ]
   },
});

module.exports = prodWebpackConfig;
