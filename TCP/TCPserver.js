/**
 * 构建TCP客户端
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    console.log('someone connects');
})

/* 设置连接的服务器 */
server.listen(8000, function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})
