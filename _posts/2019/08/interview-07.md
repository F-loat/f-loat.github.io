---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-11
title: 前端 100 问 (七)
---

61. 介绍下如何实现 token 加密
62. redux 为什么要把 reducer 设计成纯函数
63. 如何设计实现无缝轮播
64. 模拟实现一个 Promise.finally
65. a.b.c.d 和 a['b']['c']['d']，哪个性能更高
66. ES6 代码转成 ES5 代码的实现思路是什么
67. 数组编程题
68. 如何解决移动端 Retina 屏 1px 像素问题
69. 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 'AbC' 变成 'aBc'
70. 介绍下 webpack 热更新原理，是如何做到在不刷新浏览器的前提下更新页面的

<!-- more -->

## 61. [介绍下如何实现 token 加密](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/106)

* JWT

  > - 需要一个 secret（随机数）
  > - 后端利用 secret 和加密算法 (如：HMAC-SHA256) 对 payload (如账号密码) 生成一个字符串 (token)，返回前端
  > - 前端每次 request 在 header 中带上 token
  > - 后端用同样的算法解密

## 62. [redux 为什么要把 reducer 设计成纯函数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/107)

* reducer 接收旧的 state 和 action，返回新的 state
* redux 把 reducer 设计成只负责这个作用
* reducer 的职责不允许有副作用，否则会导致返回的 state 不确定
* 可以前移副作用，使 reducer 变得纯洁

## 63. [如何设计实现无缝轮播](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/108)

* 复制一个轮播的元素，当复制元素将要滚到目标位置后，把原来的元素进行归位的操作
* 动态设置 transition，复位时禁用动画

## 64. [模拟实现一个 Promise.finally](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/109)

``` js
Promise.prototype.finally = function (callback) {
  cosnt P = this.constructor
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  )
}
```

## 65. [a.b.c.d 和 a['b']['c']['d']，哪个性能更高](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/111)

* dot notation 更快，`[]` 中可能为变量
* dot notation 解析后的 AST 更为简单，解析较容易

## 66. [ES6 代码转成 ES5 代码的实现思路是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/112)

* 解析：解析代码字符串，生成 AST
* 转换：按一定的规则转换、修改 AST
* 生成：将修改后的 AST 转换成普通代码

## 67. [数组编程题](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/113)

随机生成一个长度为 10 的整数类型的数组，例如 `[2, 10, 3, 4, 5, 11, 10, 11, 20]`，将其排列成一个新数组，要求新数组形式如下 `[[2, 3, 4, 5], [10, 11], [20]]`

* Array.from(arrayLike[, mapFn[, thisArg]])
  - arrayLike: 伪数组对象 (拥有一个 length 属性和若干索引属性的任意对象)，可迭代对象
  - thisArg: 执行回调函数 mapFn 时 this 对象

## 68. [如何解决移动端 Retina 屏 1px 像素问题](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/115)

* 伪元素 + transform scaleY(.5)
* border-image
* background-image
* box-shadow

## 69. [如何把一个字符串的大小写取反（大写变小写小写变大写），例如 'AbC' 变成 'aBc'](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/116)

``` js
function processString (s) {
  const arr = s.split('')
  const new_arr = arr.map((item) => {
    return item === item.toUpperCase() ? item.toLowerCase() : item.toUpperCase()
  })
  return new_arr.join('')
}
```

## 70. [介绍下 webpack 热更新原理，是如何做到在不刷新浏览器的前提下更新页面的](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/118)

* 当修改了一个或多个文件
* 文件系统接收更改并通知 webpack
* webpack 重新编译构建一个或多个模块，并通知 HMR 服务器进行更新
* HMR Server 使用 webSocket 通知 HMR runtime 需要更新，HMR 运行时通过 HTTP 请求更新 jsonp
* HMR 运行时替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新
* HMR 需相关 Loader 支持 !?

> [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
