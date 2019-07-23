---
category: 笔记
tags:
  - 前端
date: 2019-07-22
title: 前端 100 问 (三)
---

21. 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣
22. 介绍下重绘和回流，以及如何进行优化
23. 介绍下观察者模式和订阅-发布模式的区别，各自适用于什么场景
24. 聊聊 Redux 和 Vuex 的设计思想
25. 说说浏览器和 Node 事件循环的区别
26. 介绍模块化发展历程
27. 全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取
28. cookie 和 token 都存放在 header 中，为什么不会劫持 token
29. 聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的
30. 两个数组合并成一个数组

<!-- more -->

## 21. [有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/23)

> Object.prototype.toString.call() // [object Array]
>
> instanceof Array // true
>
> Array.isArray() // true

* `toString` 方法需要使用 `call` 或者 `apply` 来改变执行上下文，可对所有的基本的数据类型进行判断

``` js
['Hello','World'].toString() // 'Hello,World'
```

* `instanceof` 通过判断对象的原型链中是否能找到类型的 `prototype`，无法判断原始类型，无法检测来自 `iframe` 的数组

``` js
'Hello,World' instanceof String // false

new String('Hello,World') instanceof String // true
```

## 22. [介绍下重绘和回流，以及如何进行优化](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/24)

* 回流 (Reflow)

回流是布局或者几何属性需要改变就称为回流，回流必定会发生重绘，重绘不一定会引发回流

* 重绘 (Repaint)

由于节点的几何属性发生改变或者由于样式发生改变而不会影响布局的，称为重绘，例如 outline，visibility，color，background-color 等，重绘的代价是高昂的，因为浏览器必须验证DOM树上其他节点元素的可见性

* 优化

  - 最小化重绘和重排
  - 批量修改 DOM
  - 避免触发同步布局事件
  - 复杂动画效果，使用绝对定位让其脱离文档流
  - css3 硬件加速 (GPU加速)

* `table` 及其内部元素在布局时可能需要多次计算，通常要花3倍于同等元素的时间，这也是避免使用 `table` 布局的原因之一

## 23. [介绍下观察者模式和订阅-发布模式的区别，各自适用于什么场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/25)

* 观察者模式中主体和观察者是互相感知的

* 发布-订阅模式是借助第三方来实现调度的，发布者和订阅者之间互不感知

![观察者模式 vs 发布-订阅模式](https://user-images.githubusercontent.com/18718461/53536375-228ba180-3b41-11e9-9737-d71f85040cfc.png)

## 24. [聊聊 Redux 和 Vuex 的设计思想](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/45)

**[Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)**


## 25. [说说浏览器和 Node 事件循环的区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/26)

* 浏览器端
  
  - 执行一个 `task` (宏任务)
  - 执行完 `micro-task` 队列 (微任务)

* Node 11 之前
  
  - 执行完一个阶段的所有任务
  - 执行完 nextTick 队列里面的内容
  - 然后执行完微任务队列的内容

* Node 11 之后和浏览器的行为统一了

## 26. [介绍模块化发展历程](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/28)

**前端模块化之前，页面引用的多个 js 文件如果相互之间有依赖，则需要注意引入的顺序，并且全局变量名不可重复为了解决这一问题，就有了模块化的规范**

* IIFE，使用自执行函数来编写模块化，特点：在一个单独的函数作用域中执行代码，避免变量冲突

``` js
(function() {
  return {
	  data: []
  }
})()
```

* CMD，是 sea.js 在推广过程中对模块定义的规范化产出，特点：支持动态引入依赖文件

``` js
define(function(require, exports, module) {  
  var indexCode = require('./index.js')
})
```

* AMD，是 RequireJS 在推广过程中对模块定义的规范化产出，特点：依赖必须提前声明好

``` js
define('./index.js', function(code) {
	// code 就是index.js 返回的内容
})
```

* CommonJS，nodejs 中自带的模块化

``` js
var fs = require('fs')
```

* UMD，兼容 AMD，CommonJS 的模块化语法

* ES Modules： ES6 引入的模块化

``` js
import a from 'a'
```

## 27. [全局作用域中，用 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/30)

**在块级作用域中，可以直接获取**

``` js
let a = 1;
const b = 2;

console.log(a); // 1
console.log(b); // 2
```

## 28. [cookie 和 token 都存放在 header 中，为什么不会劫持 token](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/31)

**token 可以防止 csxf 攻击，而无法防止 xss 攻击**

* csxf：网络请求时会自动携带 `cookie`，而后端过于乐观的将 `header` 区的 `cookie` 取到，并当作用户信息进行相关操作。解决方案：对于 `cookie` 不信任，每次请求都进行身份验证，比如 `token` 的处理

* xss: 劫持 `cookie` 或者 `localStorage`，从而伪造用户身份相关信息。前端层面 `token` 的储存位置不外乎 `cookie` `localStorage` `sessionStorage`，这些东西都是通过 js 代码获取到的。解决方案：过滤标签<>，不信任用户输入，对用户身份等 `cookie` 层面的信息进行 `http-only` 处理

## 29. [聊聊 Vue 的双向数据绑定，Model 如何改变 View，View 又是如何改变 Model 的](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/34)

* M 到 V 实现

VM 实例初始化或 `model` 动态修改时，借助于 `Object` 的 `observe` 方法，重新 `render`

* V 到 M 实现

  - 用户自定义的 `listener`，实例化时统一代理到根节点，`v-on`
  - VM 自动处理的含有 `value` 属性元素的 `listener`，`v-model`

## 30. [两个数组合并成一个数组](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/39)

> 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]

``` js
function concatArr(...args) {
  const concatedArr = args.reduce((current, next) => {
    return current.concat(next)
  }, [])

  const sortedArr = concatedArr.sort((current, next) => {
    const curFirstLetter = current.slice(0, 1)
    const nextFirstLetter = next.slice(0, 1)

    if (curFirstLetter !== nextFirstLetter) {
      return curFirstLetter < nextFirstLetter ? -1 : 1
    }

    const repReg = /^[a-zA-Z]/

    const curNumber = current.replace(repReg, '') || 0
    const nextNumber = next.replace(repReg, '') || 0

    if (curNumber > nextNumber) {
      return -1
    }

    return 1
  })

  return sortedArr
}
```
