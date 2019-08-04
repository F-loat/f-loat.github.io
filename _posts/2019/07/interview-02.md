---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-07-22
title: 前端 100 问 (二)
---

11. 算法手写题
12. JS 异步解决方案的发展历程以及优缺点
13. `Promise` 构造函数是同步执行还是异步执行，那么 `then` 方法呢
14. 情人节福利题，如何实现一个 `new`
15. 简单讲解一下 `HTTP2` 的多路复用
16. 对 `TCP` 三次握手和四次挥手的理解
17. A、B 机器正常连接后，B 机器突然重启，问 A 此时处于 `TCP` 什么状态
18. React 中 `setState` 什么时候是同步的，什么时候是异步的
19. React `setState` 笔试题，下面的代码输出什么
20. 介绍下 `npm` 模块安装机制，为什么输入 `npm install` 就可以自动安装对应的模块

<!-- more -->

## 11. [算法手写题](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/8)

> 已知如下数组：
>
> var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
>
> 编写一个程序将数组扁平化去并除其中重复部分数据，最终得到一个升序且不重复的数组

**Array.from(new Set(arr.flat(Infinity))).sort((a,b) => (a-b))**

* `Array.flat(Infinity)` 打平任意层数组

* `Array.flatMap()` 对原数组的每个成员执行一个函数，然后对返回值组成的数组执行 `flat()` 方法，只能打平一层

* `flat` 与 `flatMap` 方法均返回新数组，不会修改原有数组

## 12. [JS 异步解决方案的发展历程以及优缺点](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/11)

**callback -> Promise -> Generator -> Async/await**

* `callback` 不能用 `try catch` 捕获错误，不能 `return` 

* `Promise` 无法取消，错误需要通过回调函数来捕获

## 13. [Promise 构造函数是同步执行还是异步执行，那么 then 方法呢](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/19)

**构造函数同步，then 方法异步**

* `then` 是微任务，会在本次任务执行完的时候执行

* `setTimeout` 是宏任务，会在下次任务执行的时候执行

## 14. [情人节福利题，如何实现一个 new](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/12)

> 当代码 new Foo(...) 执行时，会发生以下事情：
>
> 1. 一个继承自 Foo.prototype 的新对象被创建
> 2. 使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象
> 3. 由构造函数返回的对象就是 new 表达式的结果，如果构造函数没有显式返回一个对象，则使用步骤1创建的对象

``` js
function _new(fn, ...arg) {
  const obj = Object.create(fn.prototype);
  const ret = fn.apply(obj, arg);
  return ret instanceof Object ? ret : obj;
}
```

## 15. [简单讲解一下 http2 的多路复用](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/14)

* `HTTP/1` 每次请求都会建立一次 HTTP 连接

* `HTTP/1.1` 默认开启 `keep-alive`，但单个连接无法交错请求，且会导致服务端连接数过多

* `HTTP2` 同域名下所有通信都在单个连接上完成，单个连接上可以并行交错的请求和响应

> HTTP2 的传输是基于二进制帧的。每一个 TCP 连接中承载了多个双向流通的流，每一个流都有一个独一无二的标识和优先级，而流就是由二进制帧组成的。二进制帧的头部信息会标识自己属于哪一个流，所以这些帧是可以交错传输，然后在接收端通过帧头的信息组装成完整的数据。这样就解决了线头阻塞的问题，同时也提高了网络速度的利用率。

## 16. [对 TCP 三次握手和四次挥手的理解](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/15)

**三次握手之所以是三次是保证 client 和 server 均让对方知道自己的接收和发送能力没问题而保证的最小次数**

> 第一次 client => server，只能 server 判断出 client 具备发送能力
> 第二次 server => client，client 就可以判断出 server 具备发送和接受能力。此时 client 还需让 server 知道自己接收能力没问题于是就有了第三次
> 第三次 client => server，双方均保证了自己的接收和发送能力没有问题
>
> 其中，为了保证后续的握手是为了应答上一个握手，每次握手都会带一个标识 seq，后续的 ACK 都会对这个 seq 进行加一来进行确认

**[作为前端的你了解多少 TCP 的内容](https://juejin.im/post/5c078058f265da611c26c235)**

## 17. [A、B 机器正常连接后，B 机器突然重启，问 A 此时处于 TCP 什么状态](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/21)

> 服务器和客户建立连接后，若服务器主机崩溃，有两种可能：
> 1. 服务器不重启，客户继续工作，就会发现对方没有回应(ETIMEOUT)，路由器聪明的话，则是目的地不可达(EHOSTUNREACH)。
> 2. 服务器重启后，客户继续工作，然而服务器已丢失客户信息，收到客户数据后响应RST。

**[UNP-网络编程基础](https://crystalwindz.com/unp_note_1)**

## 18. [React 中 setState 什么时候是同步的，什么时候是异步的](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/17)

**在 React 中，如果是由 React 引发的事件处理（比如通过onClick引发的事件处理），调用 setState 不会同步更新 this.state，除此之外的 setState 调用会同步更新 this.state。所谓“除此之外”，指的是绕过 React 通过 addEventListener 直接添加的事件处理函数，还有通过 setTimeout/setInterval 产生的异步调用。**

* React 的 `setState` 函数实现中，会根据变量 `isBatchingUpdates` 判断是同步还是异步更新 `this.state`，`isBatchingUpdates` 默认为 `false`

* React 在调用事件处理函数之前会调用 `batchedUpdates` 函数把 `isBatchingUpdates` 修改为 `true`，更新完成后恢复为 `false`

* 考虑到性能问题，可能会对多次调用作批处理，将多个 `nextState` 浅合并到当前 `state`，可在调用 `setState` 时通过传入函数避免

## 19. [React setState 笔试题，下面的代码输出什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/18)

``` jsx
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({ val: this.state.val + 1 }); // state.val === 0
    console.log(this.state.val); // 第 1 次 log

    this.setState({ val: this.state.val + 1 }); // state.val === 0
    console.log(this.state.val); // 第 2 次 log

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 }); // state.val === 1
      console.log(this.state.val); // 第 3 次 log

      this.setState({ val: this.state.val + 1 }); // state.val === 2
      console.log(this.state.val); // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```

**输出：0 0 2 3**

* 第一次和第二次都是在 react 自身生命周期内，触发时 `isBatchingUpdates` 为 `true`，不会直接执行更新 `state`，而是加入了 `dirtyComponents`

* 两次 `setState` 时，获取到 `this.state.val` 都是 0，所以执行时都是将 0 设置成 1，在 `react` 内部会被合并掉，只执行一次

* `setTimeout` 中的代码，触发时 `isBatchingUpdates` 为 `false`，会直接进行更新

## 20. [介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22)

1. npm 模块安装机制：

  * 发出 `npm install` 命令
  * 查询 `node_modules` 目录之中是否已经存在指定模块
    * 若存在，不再重新安装
    * 若不存在
      * npm 向 registry 查询模块压缩包的网址
      * 下载压缩包，存放在根目录下的 `.npm` 目录里
      * 解压压缩包到当前项目的 `node_modules` 目录

2. npm 实现原理 (v5.5.1)：

	1. 执行工程自身 preinstall
	2. 确定首层依赖模块
	3. 获取模块
	4. 模块扁平化 (去重)
	5. 安装模块
	6. 执行工程自身生命周期

> 模块安装时模块自身及项目的 `pre/post` 钩子将按顺序调用
