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