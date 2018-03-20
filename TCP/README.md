---
title: Node.js构建TCP服务器
categories:
  - 技术篇
tags:
  - Node.js
  - TCP
comments: true
toc: true
date: 2018-03-20 21:56:12

---

网络是通信互联网的基础，Node.js提供了net、http、dgram模块、分别用来实现TCP、HTTP、UDP的通信。上次的文章[《Node.js构建HTTP服务器》](https://zc95.github.io/2018/03/19/nodejs-HTTP/)实现了HTTP的通信，这篇文章说一说TCP服务器的构建。

## 用Node.js创建TCP服务器

为了使用Node.js创建TCP服务器，首先要使用require("net")来加载net模块，然后使用net模块的createServer方法就可以轻松地创建一个TCP服务器。
<!-- more -->

```javascript
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
```

运行这段代码并访问了[http://127.0.0.1:8000/](http://127.0.0.1:8000/)的话会看到控制台打印了"someone connects"，表面已经成功连接到这个创建的TCP服务器。

------

> /* 设置连接的服务器 */
> server.listen(8000, function(){
> ​    console.log("Creat server on http://127.0.0.1:8000/");
> })

上面这段代码实际上触发的是server下的listening事件，等同于：

> /* 设置监听端口 */
>
> server.listen(8000);
>
> /* 设置监听时的回调函数 */
>
> server.on("listening", function () {
>
> ​    console.log("Creat server on http://127.0.0.1:8000/");
>
> })

事实上，除了listening事件外，TCP服务器还支持以下事件：

1. connection：当有新的连接创建时触发，回调函数的参数为socket连接对象。
2. close：TCP服务器关闭的时候触发，回调函数没有参数
3. error：TCP服务器发生错误的时候触发，回调函数的参数为error对象

下列代码通过net.Server类来创建一个TCP服务器，并添加以上事件。

```javascript
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
```



## 查看服务器监听的地址

当创建了一个TCP服务器后，可以通过server.address()方法来查看这个TCP服务器监听的地址，并返回一个JSON对象。这个对象的属性有：

1. port：TCP服务器监听的端口号
2. family：说明TCP服务器监听的地址是 IPv6 还是 IPv
3. address：TCP服务器监听的地址

```javascript
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
```



## 连接服务器的客户端数量

创建一个TCP服务器后，可以通过server.getConnections()方法获取连接这个TCP服务器的客户端数量。除此之外，也可以通过maxConnections属性来设置这个服务器的最大连接数量，当连接数量超过最大值时，服务器将拒绝新的连接。

```javascript
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
```





## 服务器和客户端之间的通信

利用socket.write()可以使TCP服务器发送数据给客户端；

socket对象可以用来获取客户端发出的流数据，每次接收到数据的时候触发data事件，通过监听这个事件就可以在回调函数中获取客户端发送的数据了。

```javascript
/**
 * 发送和获取
 */

/* 引入net模块 */
var net = require("net");

/* 创建TCP服务器 */
var server = net.createServer(function(socket){
    /* 获取地址信息 */
    var address = server.address();
    var message = "the server address is"+JSON.stringify(address);

    /* 发送数据 */
    socket.write(message,function(){
        var writeSize = socket.bytesWritten;
        console.log(message + "has send");
        console.log("the size of message is"+writeSize);
    })

    /* 监听data事件 */
    socket.on('data',function(data){
        console.log(data.toString());
        var readSize = socket.bytesRead;
        console.log("the size of data is"+readSize);
    })
})

/* 获取地址信息 */
server.listen(8000,function(){
    console.log("Creat server on http://127.0.0.1:8000/");
})
```



## LINK

github源码：[https://github.com/zc95/nodeTest/tree/master/TCP](https://github.com/zc95/nodeTest/tree/master/TCP)
