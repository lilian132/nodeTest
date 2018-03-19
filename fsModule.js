/**
 * fs模块
 */

/* 引入http模块 */
var http = require("http");

/* 引入fs模块 */
var fs = require("fs");

/* 创建HTTP服务器 */
var server = http.createServer(function(request, response) {
    /* 设置响应的头部 */
    response.writeHead(200, {
        "content-Type" : "text/html"
    });

    /* 读取文件数据 */
    var data = fs.readFileSync("./index.html");

    /* 设置响应的数据 */
    response.write(data);
    response.end();
});

/* 设置服务器端口 */
server.listen(8000, function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})
