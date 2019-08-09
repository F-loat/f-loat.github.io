---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-09
title: 前端 100 问 (五)
---

41. 下面代码输出什么
42. 实现一个 sleep 函数
43. 使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果
44. 介绍 HTTPS 握手过程
45. HTTPS 握手过程中，客户端如何验证证书的合法性
46. 输出以下代码执行的结果并解释为什么
47. 双向绑定和 vuex 是否冲突
48. call 和 apply 的区别是什么，哪个性能更好一些
49. 为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片
50. （百度）实现 (5).add(3).minus(2) 功能

<!-- more -->

## 41. [下面代码输出什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/61)

``` js
var a = 10;
(function () {
  console.log(a)
  a = 5
  console.log(window.a)
  var a = 20;
  console.log(a)
})()
```

[变量提升](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)仅提升声明，而不提升初始化

## 42. [实现一个 sleep 函数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/63)

* Promise

* Generator

``` js
function* sleepGenerator(time) {
  yield new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}

sleepGenerator(1000).next().value.then(() => { console.log(1) })
```

* Async

* ES5

``` js
function sleep(callback, time) {
  if (typeof callback === 'function') {
    setTimeout(callback, time)
  }
}

sleep(() => { console.log(1) }, 1000)
````

## 43. [使用 sort() 对数组 [3, 15, 8, 29, 102, 22] 进行排序，输出结果](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/66)

[sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description) 方法会先把比较的内容转换为字符串

## 44. [介绍 HTTPS 握手过程](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/70)

![HTTPS](http://rapheal-wordpress.stor.sinaapp.com/uploads/2015/09/%E4%B8%80%E6%AC%A1%E5%8F%AF%E9%9D%A0%E7%9A%84%E9%80%9A%E4%BF%A1.png)

## 45. [HTTPS 握手过程中，客户端如何验证证书的合法性](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/74)

* 校验证书的颁发机构是否受客户端信任
* 通过 CRL 或 OCSP 的方式校验证书是否被吊销
* 对比系统时间，校验证书是否在有效期内
* 通过校验对方是否存在证书的私钥，判断证书的网站域名是否与证书颁发的域名一致

## 46. [输出以下代码执行的结果并解释为什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/76)

``` js
var obj = {
  '2': 3,
  '3': 4,
  'length': 2,
  'splice': Array.prototype.splice,
  'push': Array.prototype.push
}
obj.push(1)
obj.splice(0, 1)
console.log(obj)
```

* call [push](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/push#Description) 这个方法如果对象有 length 属性，length 属性会加 1 并返回
* 调用 push 方法的时候会在调用对象的 key=length 的地方做一个赋值
* 对象如果有 push 和 splice 会输出会转换为数组

## 47. [双向绑定和 vuex 是否冲突](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/81)

* 严格模式下会报错，用户输入时，v-model 会试图直接修改属性值，但这个修改不是在 mutation 中进行的

* 解决方式
  - 在 input 中绑定 value (vuex 中的 state)，然后监听 input 的事件，在事件回调中调用 mutation 修改 state 的值
  - 使用带有setter的双向绑定计算属性

  ``` js
  computed: {
    message: {
      get () { return this.$store.state.obj.message },
      set (value) { this.$store.commit('updateMessage', value) } 
    }
  }
  ```

## 48. [call 和 apply 的区别是什么，哪个性能更好一些](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/84)

* Function.prototype.apply 和 Function.prototype.call 的作用是一样的，区别在于传入参数的不同
* 第一个参数都是，指定函数体内 this 的指向
* 第二个参数开始不同
  - apply 是传入带下标的集合，数组或者类数组，apply 把它传给函数作为参数
  - call 从第二个开始传入的参数数量是不固定的，都会传给函数作为参数
* call 比 apply 的性能要好

* ES6 引入了 Spread operator ([剩余参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)) 后，即使参数是数组，也可以使用 call

## 49. [为什么通常在发送数据埋点请求的时候使用的是 1x1 像素的透明 gif 图片](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/87)

* 能够完成整个 HTTP 请求+响应（尽管不需要响应内容）
* 触发 GET 请求之后不需要获取和处理数据、服务器也不需要发送数据
* 跨域友好
* 执行过程无阻塞
* 相比 XMLHttpRequest 对象发送 GET 请求，性能上更好
* GIF的最低合法体积最小（最小的 BMP 文件需要74个字节，PNG 需要67个字节，而合法的 GIF，只需要43个字节）

## 50. [（百度）实现 (5).add(3).minus(2) 功能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/88)

``` js
Number.prototype.add = function (n) {
  return this.valueOf() + n
}
Number.prototype.minus = function (n) {
  return this.valueOf() - n
}
```

* toPrecision 是处理精度，精度是从左至右第一个不为 0 的数开始数起
* toFixed 是小数点后指定位数取整，从小数点开始数起

``` js
// 四舍五入存在 bug，使用 https://github.com/dt-fe/number-precision
1.005.toFixed(2) // 1.00 而不是 1.01
```

* 数据展示

``` js
function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision))
}
```

* 数据运算，把小数转成整数后再运算

``` js
function add(num1, num2) {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (num1 * baseNum + num2 * baseNum) / baseNum
}
```
