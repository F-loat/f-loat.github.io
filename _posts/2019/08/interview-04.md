---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-07
title: 前端 100 问 (四)
---

31. 改造下面的代码，使之输出0 - 9，写出你能想到的所有解法
32. Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法
33. 下面的代码打印什么内容，为什么？
34. 简单改造下面的代码，使之分别打印 10 和 20
35. 浏览器缓存读取规则
36. 使用迭代的方式实现 flatten 函数
37. 为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作
38. （京东）下面代码中 a 在什么情况下会打印 1
39. 介绍下 BFC 及其应用
40. 在 Vue 中，子组件为何不可以修改父组件传递的 Prop

<!-- more -->

## 31. [改造下面的代码，使之输出0 - 9，写出你能想到的所有解法](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/43)

``` js
for (var i = 0; i< 10; i++) {
	setTimeout(() => {
		console.log(i)
  }, 1000)
}
```

* setTimeout 函数的第三个参数，会作为回调函数的第一个参数传入

``` js
for (var i = 0; i < 10; i++) {
  setTimeout(i => {
    console.log(i)
  }, 1000, i)
}
```

* 利用其它方式构造出块级作用域

## 32. [Virtual DOM 真的比操作原生 DOM 快吗？谈谈你的想法](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/47)

* 框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护

* Virtual DOM 的引入避免了每次变动后对整个 innerHTML 的直接重置，相对于 DOM 操作，js 计算是极其便宜的

* Virtual DOM 真正的价值从来都不是性能，而是它 1) 为函数式的 UI 编程方式打开了大门；2) 可以渲染到 DOM 以外的 backend，比如 ReactNative

## 33. [下面的代码打印什么内容，为什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/48)

``` js
var b = 10;
(function b() {
  b = 20
  console.log(b)
})()
```

* `var b = 10` 后若不加分号，会识别为 `10()`，导致报错

* [函数表达式](https://developer.mozilla.org/zh-CN/docs/web/JavaScript/Reference/Operators/function)与函数声明不同，函数名只在该函数内部有效，并且此绑定是常量绑定

* [圆括号运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Grouping)包裹表达式，所以其内部为函数表达式，而非函数声明

## 34. [简单改造上题的代码，使之分别打印 10 和 20](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/51)

* 10

``` js
var b = 10;
(function b() {
  b = 20
  console.log(window.b)
})()
```

* 20

  - 构造块级作用域

  ``` js
  var b = 10;
  (function b() {
    var b = 20
    console.log(b)
  })()
  ```

  - 作为参数传入
  ``` js
  var b = 10;
  (function b(b) {
    b = 20
    console.log(b)
  })(b)
  ```

## 35. [浏览器缓存读取规则](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/53)

* Service Worker 开发者控制缓存规则，未命中缓存的话，会根据缓存查找优先级去查找数据，但浏览器都会显示为从 Service Worker 中获取
* Memory Cache 主要包含的是当前中页面中已经抓取到的资源，关闭 Tab 页面后释放
* Disk Cache 根据 HTTP Herder 中的字段判断哪些资源需要缓存
* Push Cache HTTP/2 服务端推送，当以上三种缓存都没有命中时，才会被使用，只在会话（Session）中存在，一旦会话结束就被释放

> 对于大文件来说，大概率是不存储在内存中的，反之优先；当前系统内存使用率高的话，文件优先存储进硬盘

## 36. [使用迭代的方式实现 flatten 函数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/54)

``` js
function flatten(arr) {
  let arrs = [...arr]
  let newArr = []
  while (arrs.length) {
    let item = arrs.shift()
    if(Array.isArray(item)) {
      // 将数组 item 的每一项放入 arrs 中
      arrs.unshift(...item)
    } else {
      newArr.push(item)
    }
  }
  return newArr
}
```

## 37. [为什么 Vuex 的 mutation 和 Redux 的 reducer 中不能做异步操作](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/65)

* 不利于 devtools 对状态的改变进行跟踪

* reducer 是用来计算 state 的，所以它的返回值必须是 state

``` js
currentState = currentReducer(currentState, action)
```

## 38. [（京东）下面代码中 a 在什么情况下会打印 1](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/57)

``` js
var a = '?'
if (a == 1 && a == 2 && a == 3) {
 	conso.log(1)
}
```

* 隐式转换

``` js
// toString
let a = {
  i: 1,
  toString () {
    return a.i++
  }
}

// valueOf
let a = {
  i: 1,
  valueOf () {
    return a.i++
  }
}
```

## 39. [介绍下 BFC 及其应用](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/59)

[BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context) (块级格式上下文)，是页面盒模型布局中的一种 CSS 渲染模式，相当于一个独立的容器，里面的元素和外部的元素相互不影响，主要作用如下

* 清除浮动
* 防止同一 BFC 容器中的相邻元素间的外边距重叠问题

## 40. [在 Vue 中，子组件为何不可以修改父组件传递的 Prop](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/60)

* 单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置

* 在组件 initProps 时，会对 props 进行 defineReactive 操作，传入的第四个参数是自定义的 set 函数，该函数会在触发 props 的 set 方法时执行，当 props 修改了，就会运行这里传入的第四个参数，然后进行判断，如果不是 root 根组件，并且不是更新子组件，那么说明更新的是 props，给出警告

``` js
if (process.env.NODE_ENV !== 'production') {
  const hyphenatedKey = hyphenate(key)
  if (isReservedAttribute(hyphenatedKey) ||
      config.isReservedAttr(hyphenatedKey)) {
    warn(
      ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
      vm
    )
  }
  defineReactive$$1(props, key, value, function () {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        "Avoid mutating a prop directly since the value will be " +
        "overwritten whenever the parent component re-renders. " +
        "Instead, use a data or computed property based on the prop's " +
        "value. Prop being mutated: \"" + key + "\"",
        vm
      )
    }
  })
}
```
