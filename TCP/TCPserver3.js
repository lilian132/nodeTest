/**
 * 查看服务器监听的地址
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    console.log('someone connects');
})

/* 获取地址信息 */
server.listen(8000,function(){
    /* 获取地址信息，得到的是一个json { address: '::', family: 'IPv6', port: 8000 } */
    var address = server.address();
    
    /* TCP服务器监听的端口号 */
    console.log("the port of server is"+ address.port);

    /* TCP服务器监听的地址 */
    console.log("the address of server is"+ address.address);

    /* 说明TCP服务器监听的地址是 IPv6 还是 IPv4 */
    console.log("the family of server is"+ address.family);
})


