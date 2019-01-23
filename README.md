# webpack 多页面打包配置
It's a config demo to  pack multi page used webpack


## 一、前期准备
1、搭建项目框架

>
- 新建项目文件夹newdemo
- 项目初始化npm init
- 安装webpack、webpack-cli，npm i -D webpack webpack-cli

2、完善项目目录结构

![](https://i.imgur.com/WZDZ4a2.png) 
> build:存放webpack配置
> 
> static:存放无需打包的静态资源
> 
> src:主要打包的文件夹，assets->需打包的静态资源，lib->项目依赖框架或插件，views->项目视图页面

3、新建项目文件

![](https://i.imgur.com/VrakWcj.png) 

>规范项目目录，使项目变得更可维护
>
>webpack.base.config.js->webpack打包公用配置
>
>webpack.dev.config.js->开发环境配置
>
>webpack.prod.config.js->生产环境配置

4、配置package.json,新增打包命令

![](https://i.imgur.com/OReh4H7.png)

>
- npm run dev
- npm run build

## 二、开始配置

1、在build文件下,新建entry.config.js文件,使用glob模块，获取所有入口文件

>安装
>
>- glob：根据规则，匹配查找文件

    /**
     * 页面入口配置
     * 动态查找所有入口文件
    */
    
    // 导入模块
    const path = require("path");
    const glob = require("glob");
    
    let newEntry = {};
    // 获取src/assets下的index.js入口文件
    let jsFiles = glob.sync(path.resolve(__dirname,'../src/assets/**/js/index.js'));
    // console.log(jsFiles)
    for(let item of jsFiles){
    	let patternUrl = /.*(\/src\/.*?index\.js)/;//获取文件路径
    	let patternName = /.*\/(.*?)\/js\/index\.js$/; //获取文件名称
    	let url = patternUrl.exec(item)[1];//0-原串 1-匹配的内容
    	let name = patternName.exec(item)[1];
    	newEntry[name] = '.'+url;
    }
    module.exports = newEntry;

2、在build文件下,新建web.config.js文件，使用html-webpack-plugin插件处理html模板

>安装 
>
>- html-webpack-plugin:页面自动化构建插件

    /**
     *  页面模版配置
     *  动态查找所有HTML文件
    */
    
    // 导入模块
    const path = require("path");
    const glob = require("glob");
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    
    // 获取src/views下的html文件
    let files = glob.sync(path.resolve(__dirname,'../src/views/**/*.html'));
    let newHtmls = [];
    for(let item of files){
    	let patternUrl = /.*(\/src\/.*?\.html)/;//获取路径
    	let patternName = /.*\/(.*?)\.html$/; //获取名字
    	let url = patternUrl.exec(item)[1];//0-原串 1-匹配的内容 null-未匹配
    	let name = patternName.exec(item)[1];
    	url = path.join(__dirname, '..'+url);
    	newHtmls.push(new HtmlWebpackPlugin({
    		filename:name+'.html',
    		template:url,
    		inject:true,//默认true插入body,head | body | false 
    		minify:{
    			// collapseWhitespace: true,//移除空格
    			removeComments: true,//移除注释
    		},
    		chunks:['common',name],
    		//common为提取出来的公共代码，如在多页面里均引入的jquery一样，提取出来减少入口js打包体积
    	}));
    }
    // console.log(newHtmls)
    module.exports = newHtmls;

3、公共的打包配置

> 安装：
> 
- html-loder：处理html页面；
- babel-loader：处理js文件；
- url-loader：处理文字、图片、音视频等；
- copy-webpack-plugin：复制static离无需打包的静态资源；

>命令：
>npm i -D copy-webpack-plugin url-loader html-loader babel-loader babel-core  babel-preset-env @babel/core @babel/preset-env

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

>注意：在使用babel-loader解析es6的语法时，需在项目根目录新建.babelrc文件，配置babel-loader
>
![](https://i.imgur.com/PquFfkV.png)

4、开发环境的配置

> 安装:
> 
>- webpack-merge：合并配置
>- webpack-dev-server：开发环境服务
>- style-loader：处理css
>- css-loader：处理css
>- sass-loader：处理scss
>- postcss-loader：自动补全浏览器前缀

> 命令:
> npm i -D webpack-merge webpack-dev-server style-loader css-loader sass-loader node-sass postcss-loader postcss-plugin autoprefixer 

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


> 注意：在使用postcss-loader,自动补全浏览器前缀时，须得在项目根目录下新建.postcssrc.js文件，配置postcss-loader，当然也可在使用loader时配置options,详细不做多说，毕竟通用前者，否则，每使用一次就要配置一次，这强撸的方式，光想就头皮发麻。
> ![](https://i.imgur.com/DA51BeT.png)

5、生产环境的配置

> 安装:
> 
>- mini-css-extract-plugin：拆分js与css插件
>- optimize-css-assets-webpack-plugin：压缩css文件插件
>- purifycss-webpack：css去重
>- uglifyjs-webpack-plugin:js压缩插件
>- clean-webpack-plugin：删除文件夹或文件插件


>命令：
>npm i -D mini-css-extract-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin clean-webpack-plugin  cssnano purifycss-webpack purify-css

	//导入文件
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
    		new Purify({ //css优化去重去无效代码
    			paths:glob.sync(path.join(__dirname,"src/views/*.html"))
    		})
    	],
    	module:{
    		rules:[
    
    			{
    				test:/\.css$/,//处理css文件
					use: [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader','sass-loader'],
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

## 三、总结

辛苦了许久，终于把webpack的配置学了个入门，以上webpack4.x的配置，是我这段时间学习webpack的成果，虽有很多不足之处，但现在的我已经能根据打包需求，称心地修改webpack的配置文件了。犹记得自己，刚看见vue-cli中webpack配置文件时的感概——啊，这也太屌了吧！到现在不知不觉地写出了多页面的打包配置，内心的潜台词是——哈，我也太屌了吧。以后的路还长，希望自己能一直保持这种热情，去探索更多神奇且未知的领域。

常言道：书山有路勤为径，学海无涯苦作舟；只有当自己踏入这扇门时，才能触及自己身处之天地之广阔。
