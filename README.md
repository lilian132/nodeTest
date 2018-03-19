

Node.js® is a JavaScript runtime built on [Chrome's V8 JavaScript engine](https://developers.google.com/v8/). Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, [npm](https://www.npmjs.com/), is the largest ecosystem of open source libraries in the world.



## Node.js简介

`Node.js` 是一个基于 Google Chrome V8 引擎 的 JavaScript 运行环境。Node.js使用后多种先进的技术，其中包括 事件驱动、非阻塞 I/O 模型，使其轻量又高效，受到众多开发者的追捧。



简单的说，Node.js 就是运行在服务端的 JavaScript ，可以稳定地在各种平台下运行，包括Linux、Windows、Mac OS X、Sun Os 和FreeBSD等众多平台。





## 安装nodejs

1. 点击 [https://nodejs.org](https://nodejs.org) 进入nodejs官网
2. 有两个版本：LTS和Current，LTS是长期支持版本，成熟可靠
3. next到底
4. 打开终端，输入 `node -v` ，回车，如果出现类似 `v6.11.4` 的版本号就说明安装成功

<!-- more -->

## 构建一个HTTP服务器

在如今web大行其道的时代，支撑无数网页运行的正是HTTP服务器。Node.js之所以受到大量web开发者的青睐，与Node.js有能力自己构建服务器是分不开的。

1. 在根目录下新建一个 `nodetest` 的文件夹

2. 在 `nodetest` 下新建一个 `server.js` 的文件

3. 拷贝粘贴这段代码，保存：

   ```javascript
   /**
    * 创建http服务器
    */

   /* 引入http模块 */
   var http = require("http");

   /* 创建HTTP服务器 */
   var server = http.createServer(function(request, response) {
       /* 设置相应的头部 */
       response.writeHead(200, {
           "content-Type" : "text/plain"
       });

       /* 设置相应的数据 */
       response.write("Welcome to Nodejs");
       response.end();
   });

   /* 设置服务器端口 */
   server.listen(8000, function(){
       console.log("Creat server on http://127.0.0.1:8000/");
   })
   ```

4. 打开终端 输入 `cd nodetest ` 回车，`ls` 回车，确保server.js在文件夹nodetest下

5. 输入 `node server.js` 回车，返回 `Creat server on http://127.0.0.1:8000/`

6. 打开浏览器输入 `http://127.0.0.1:8000/` 或者 `http://localhost:8000` 

7. Welcome to Nodejs



## 文件模块

上面说到的HTTP服务器知识实现了将一串字符串发送给服务器。很明显，如果服务器只能发送一些字符串，那几乎是远远不够的，因此我们要做一些扩展，通过文件模块将文件读取并发送给服务器是一个不错的选择，在nodetest文件夹下新建 `fsModule.js` :

```javascript
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

```

同时在同级目录中创建一个名为 `index.html` 的文件，写入以下代码：

```javascript
<! doctype <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>fs module</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>fs文件模块</h1>
</body>
</html>
```

node fsModule.js 运行，在浏览器中打开 `http://localhost:8000` ，Node.js已经把index这个文件发送到客户端了；

需要提及的是，这里HTTP服务器在发送给浏览器的头部信息中将 content-type修改为了 `text/html` 。 content-type的人作用就是用来表示客户端或者服务器传输数据的类型，服务器或者客客户端通过这个值来做相应的解析。如果这个值改为原来的 `text/plain` ，浏览器将显示index.html的所有源代码，这显然不是我们想要的。



## HTTP服务器的路由控制

上一节中的服务器虽然已经可以通过读取文件数据来发送给客户端了，但你并没有做任何的路由控制，在浏览器中输入任何URL都将返回同样的内容，简单来说，路由就是URL到函数的映射。



要做到路由控制，通过上面的学习可以预想到修改content-type就可以了，这里假定只需要处理html、js、css和图片文件，创建一个名为 `mime.js` 的文件：

```javascript
module.exports = {
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "text/javascript",
    ".gif" : "image/gif",
    ".ico" : "image/x-icon",
    ".jpeg" : "image/jpeg",
    ".jpg" : "image/jpeg",
    ".png" : "image/png",
}
```



创建一个名为 `fsModule2.js` 的文件：

```javascript
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

```

这里通过对路径处理判断来返回不同的资源，从而做到简单的路由控制。



## LINK

github源码：[https://github.com/zc95/nodeTest](https://github.com/zc95/nodeTest)
博客：[https://zc95.github.io/2018/03/19/nodeTest/](https://zc95.github.io/2018/03/19/nodeTest/)

