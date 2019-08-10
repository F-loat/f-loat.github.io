---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-10
title: 前端 100 问 (六)
---

51. Vue 的响应式原理中 Object.defineProperty 有什么缺陷
52. 怎么让一个 div 水平垂直居中
53. 输出以下代码的执行结果并解释为什么
54. 冒泡排序如何实现，时间复杂度是多少， 还可以如何改进？
55. 某公司 1 到 12 月份的销售额存在一个对象里面
56. 要求设计 LazyMan 类，实现以下功能
57. 分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景
58. 箭头函数与普通函数（function）的区别是什么，构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗，为什么
59. 给定两个数组，写一个方法来计算它们的交集
60. 已知如下代码，如何修改才能让图片宽度为 300px，注意下面代码不可修改

<!-- more -->

## 51. [Vue 的响应式原理中 Object.defineProperty 有什么缺陷](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/90)

* 数组的 length 不能重新定义，无法监听
* Object.defineProperty 无法对新增属性实现监听
* 出于性能考虑，vue 未对数组进行遍历，在数组已有元素中 (非对象元素)，更改某一元素的值，不会进行响应，需手动调用 Vue.set

``` js
export default {
  data () {
    return {
      testArr: [1, 2, 3]
    }
  },
  methods: {
    testMethod (set) {
      if (set) {
        this.$set(this.testArr, 1, Math.random())
      } else {
        this.testArr[1] = Math.random() // 视图未更新
      }
      console.log(this.testArr[1])
    }
  }
}
```

* Object.defineProperty 只能劫持对象的属性，从而需要对每个对象，每个属性进行遍历，如果，属性值是对象，还需要深度遍历
* Proxy 不仅可以劫持整个对象、数组，可以代理动态增加的属性，最后返回一个新的对象

## 52. [怎么让一个 div 水平垂直居中](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/92)

* flex
* grid
* position transform
* display: table-cell

## 53. [输出以下代码的执行结果并解释为什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/93)

``` js
var a = { n: 1 }
var b = a
a.x = a = { n: 2 }

console.log(a.x) 	
console.log(b.x)
```

* `.` 优先级高于 `=`
* `=` 运算自右向左

## 54. [冒泡排序如何实现，时间复杂度是多少， 还可以如何改进？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/94)

* O(n^2)
* 两层循环，对未排序部分比较大小
* 优化：记录本次比对后，未排序部分首个元素的 index

## 55. [某公司 1 到 12 月份的销售额存在一个对象里面](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/96)

对象如下：`{1:222, 2:123, 5:888}`，请把数据处理为以下结构：`[222, 123, null, null, 888, null, null, null, null, null, null, null]`

``` js
let obj = { 1:222, 2:123, 5:888 }
const result = Array.from({ length: 12 }).map((_, index) => obj[index + 1] || null)
```

## 56. [要求设计 LazyMan 类，实现以下功能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/98)

``` js
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

* return this
* 任务队列

``` js
class LazyManClass {
  constructor(name) {
    this.queue = []
    this.name = name
    console.log(`Hi I am ${this.name}`)
    setTimeout(() => {
      this.next() // 异步执行队列
    }, 0)
  },
  sleep (time) {
    const fn = () => {
      setTimeout(() => {
        console.log(`等待了${time}秒...`)
        this.next()
      }, time * 1000)
    }
    this.queue.push(fn)
    return this
  },
  sleepFirst () {
    // ...
    this.queue.unshift(fn)
  }
  next () {
    const fn = this.queue.shift()
    fn && fn()
  }
}

function LazyMan(name) {
  return new LazyManClass(name)
}
```

## 57. [分析比较 opacity: 0、visibility: hidden、display: none 优劣和适用场景](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/100)

* display: none
  - DOM 结构：浏览器不会渲染 display 属性为 none 的元素，不占据空间；
  - 事件监听：无法进行 DOM 事件监听；
  - 性能：动态改变此属性时会引起重排，性能较差；
  - 继承：不会被子元素继承，毕竟子类也不会被渲染；
  - `transition：transition` 不支持 display。

* visibility: hidden
  - DOM 结构：元素被隐藏，但是会被渲染不会消失，占据空间；
  - 事件监听：无法进行 DOM 事件监听；
  - 性 能：动态改变此属性时会引起重绘，性能较高；
  - 继 承：会被子元素继承，子元素可以通过设置 `visibility: visible` 来取消隐藏；
  - `transition：transition` 不支持 display。

* opacity: 0
  - DOM 结构：透明度为 100%，元素隐藏，占据空间；
  - 事件监听：可以进行 DOM 事件监听；
  - 性 能：提升为合成层，不会触发重绘，性能较高；
  - 继 承：会被子元素继承，且子元素并不能通过 `opacity: 1` 来取消隐藏；
  - `transition：transition` 不支持 opacity。

## 58. [箭头函数与普通函数（function）的区别是什么，构造函数（function）可以使用 new 生成实例，那么箭头函数可以吗，为什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/101)

箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：

* 函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象
* 不可以使用 arguments 对象，该对象在函数体内不存在，如果要用，可以用 [rest 参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Rest_parameters)代替
* 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数
* 不可以使用 new 命令，因为：
  - 没有自己的 this，无法调用 call，apply
  - 没有 prototype 属性，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__


## 59. [给定两个数组，写一个方法来计算它们的交集](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/102)

> 例如：给定 nums1 = [1, 2, 2, 1]，nums2 = [2, 2]，返回 [2, 2]

* 哈希表 O(m + n)
* 这个有实际用到过

## 60. [已知如下代码，如何修改才能让图片宽度为 300px，注意下面代码不可修改](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/105)

``` html
<img src="1.jpg" style="width: 480px !important;">
```

* `max-width: 300px`
* `transform: scale(0.625, 0.625)`
* border-box
* animation
