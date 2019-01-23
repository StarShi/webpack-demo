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
		// filename:name+'/'+name+'.html',
		filename:name+'.html',
		template:url,
		inject:true,//默认true插入body,head | body | false 
		minify:{
			// collapseWhitespace: true,//移除空格
			removeComments: true,//移除注释
		},
		chunks:['common',name],
		//common为提取出来的公共代码，如在多页面里均引入的jquery一样，提取出来减少打包体积
	}));
}
// console.log(newHtmls)
module.exports = newHtmls;