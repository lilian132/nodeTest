/**
 * 连接服务器的客户端数量
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    console.log('someone connects');

    /* 设置最大连接数量 */
    server.maxConnections=3;
    server.getConnections(function(err,count){
        console.log("the count of client is "+count);
    })
})

/* 获取监听端口 */
server.listen(8000,function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})


