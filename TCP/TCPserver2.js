/**
 * 通过net.Server类来创建一个TCP服务器
 */

/* 引入net模块 */
var net = require("net");

/* 实例化一个服务器对象 */
var server = new net.Server();

/* 监听 connection 事件 */
server.on("connection", function (socket) {
    console.log("someone connects");
});

/* 设置监听端口 */
server.listen(8000);

/* 设置监听时的回调函数 */
server.on("listening", function () {
    console.log("Creat server on http://127.0.0.1:8000/");
})

/* 设置关闭时的回调函数 */
server.on("close", function () {
    console.log("server closed!");
})

/* 设置错误时的回调函数 */
server.on("error", function (err) {
    console.log("error!");
})

