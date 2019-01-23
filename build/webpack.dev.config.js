//导入文件
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');//配置合并模块
const baseWebpackConfig = require('./webpack.base.config');//公共配置模块

let devWebpackConfig = merge(baseWebpackConfig,{
	mode:'development',
	module: {
    	rules: [
			{
				test:/\.css$/,
			    use: ['style-loader','css-loader', 'postcss-loader','sass-loader'],
				include:[path.resolve(__dirname,'../src/')]
			},
			{
				test:/\.scss$/,
			    use: ['style-loader','css-loader', 'postcss-loader','sass-loader'],
				include:[path.resolve(__dirname,'../src/')]
			},
    	]
  	},
  	devtool:'cheap-module-eval-source-map',
  	devServer:{//设置服务
		// 设置服务器访问的基本目录
		contentBase:false, //最好设置成绝对路径
		publicPath:'/',
		// 设置服务器的ip地址,可以是localhost
		host:'localhost',
		// 设置端口
		port:8080,
		// 设置自动拉起浏览器
		// open:true,
		historyApiFallback:true,//配置信息
		//该属性设置热更新无效
		// hot:true 
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//调用webpack的热更新插件
	]
});

module.exports = devWebpackConfig;