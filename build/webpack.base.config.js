//导入文件
const path = require('path');
const entry = require('./entry.config');
const htmls = require('./web.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve (dir) {//处理别名路径
	return path.join(__dirname, '..', dir);
}
let config = {
	entry:entry,
	output: {//出口文件
		filename: "[name]/js/[name]-[hash].js",//打包后输出文件的文件名
		path: path.join(__dirname, "../public"),//打包后的文件存放的地方,__dirname指当前根目录
		publicPath:'/',
	},
	resolve: {
	    extensions: ['.js','.json','.css','.scss'],//引用可省略扩展
	    alias: { //别名
	      '@': resolve('src'),
	    }
	},
	module: {
	    rules: [
			{
				test: /\.html$/,//处理html模板
				use: 'html-loader',
			},
			{
				test: /\.js$/,//转换js文件中的es6语法
				use: 'babel-loader',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			{
	            test:/\.(png|jpg|gif|jpeg|svg)(\?.*)?$/,//打包图片
	            use:[{
	                    loader: "url-loader",
	                    options: {
	                        name: "[name].[hash].[ext]",//文件名称
	                        limit: 10000, //限制大小，超过则默认使用file-loader处理
	                        outputPath:'static/images' //输出路径
	                    }
	            }],
	            include:[resolve('src')]
	        },
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,//打包音视频文件
	            use:[{
	                    loader: "url-loader",
	                    options: {
	                        name: "[name].[hash].[ext]",//文件名称
	                        limit: 10000, //限制大小，超过则默认使用file-loader处理
	                        outputPath:'static/media'//输出路径
	                    }
	            }],
	      		include:[resolve('src')]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,//打包字体文件
				use:[{
	                    loader: "url-loader",
	                    options: {
	                        name: "[name].[hash].[ext]",//文件名称
	                        limit: 10000, //限制大小，超过则默认使用file-loader处理
	                        outputPath:'static/fonts'//输出路径
	                    }
	            }],
	            include:[resolve('src')]
			}
	    ]
	},
	plugins:[
		new CopyWebpackPlugin([//复制静态资源
			{
				from: path.resolve(__dirname, '../static'),
				to: path.join(__dirname,'../public/static'),
				ignore: ['.*'],
			}
		])
	]
};
for(let item of htmls){
	config.plugins.push(item);
}
module.exports = config;