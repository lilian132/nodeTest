/**
 * 这里通过路径处理判断来返回不同的资源，从而做到简单的路由控制
 */

/* 引入http模块 */
var http = require("http");

/* 引入fs模块 */
var fs = require("fs");

/* 引入url模块 */
var url = require("url");

/* 引入mime文件 */
var mime = require("./mime.js");

/* 引入path模块 */
var path = require("path");

/* 创建HTTP服务器 */
var server = http.createServer(function(request, response) {
    var filePath = "."+url.parse(request.url).pathname;
    if(filePath === "./"){
        filePath = './index.html'
    }

    /* 判断相应的文件是否存在 */
    fs.exists(filePath,function(exists){
        /* 存在则返回相应文件数据 */
        if(exists){
            var data = fs.readFileSync(filePath);
            var contentType = mime[path.extname(filePath)];
            response.writeHead(200,{
                "content-type": contentType
            });
            response.write(data);
            response.end();
        }else{
            response.end("404");
        }
    })
});

/* 设置服务器端口 */
server.listen(8000, function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})
