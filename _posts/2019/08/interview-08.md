---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-11 23:00:00
title: 前端 100 问 (八)
---

71. 实现一个字符串匹配算法
72. 为什么普通 for 循环的性能远远高于 forEach 的性能
73. 介绍下 BFC、IFC、GFC 和 FFC
74. 使用 JavaScript Proxy 实现简单的数据绑定
75. 数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少
76. 输出以下代码运行结果
77. 算法题「旋转数组」
78. Vue 的父组件和子组件生命周期钩子执行顺序是什么
79. input 搜索如何防抖，如何处理中文输入
80. 介绍下 Promise.all 使用、原理实现及错误处理

<!-- more -->

## 71. [实现一个字符串匹配算法](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/119)

> 从长度为 n 的字符串 S 中，查找是否存在字符串 T，T 的长度是 m，若存在返回所在位置

* [indexOf](https://www.cnblogs.com/rubylouvre/p/6658625.html)

  - Brute-Force 算法
  - [KMP 算法](http://www.ruanyifeng.com/blog/2013/05/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm.html)
  - Boyer-Moore 算法
  - BMH 算法
  - Sunday 算法
  - Shift-And 和 Shift-OR 算法
  - bitmap 算法思想

## 72. [为什么普通 for 循环的性能远远高于 forEach 的性能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/121)

* for 循环没有任何额外的函数调用栈和上下文
* forEach 还有诸多参数和上下文需要在执行的时候考虑进来，可能拖慢性能

## 73. [介绍下 BFC、IFC、GFC 和 FFC](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/122)

* BFC: 块级格式化上下文
* IFC: 内联格式化上下文
* GFC: 网格布局格式化上下文
* FFC: 自适应格式化上下文

## 74. [使用 JavaScript Proxy 实现简单的数据绑定](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/123)

待补充

## 75. [数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/124)

* 数组可以直接根据索引取的对应的元素，所以不管取哪个位置的元素的时间复杂度都是 O(1)
* JavaScript 没有真正意义上的数组，所有的数组其实是对象，其“索引”看起来是数字，其实会被转换成字符串，作为属性名 (对象的 key) 来使用

## 76. [输出以下代码运行结果](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/125)

``` js
// example 1
var a={}, b='123', c=123;  
a[b]='b';
a[c]='c';  
console.log(a[b]);

// example 2
var a={}, b=Symbol('123'), c=Symbol('123');  
a[b]='b';
a[c]='c';  
console.log(a[b]);

// example 3
var a={}, b={key:'123'}, c={key:'456'};  
a[b]='b';
a[c]='c';  
console.log(a[b]);
```

* 对象的键名只能是字符串和 Symbol 类型
* 其他类型的键名会被转换成字符串类型
* 对象转字符串默认会调用 toString 方法

## 77. [算法题「旋转数组」](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/126)

```
示例1:
输入: [1, 2, 3, 4, 5, 6, 7] 和 k = 3
输出: [5, 6, 7, 1, 2, 3, 4]
解释:
向右旋转 1 步: [7, 1, 2, 3, 4, 5, 6]
向右旋转 2 步: [6, 7, 1, 2, 3, 4, 5]
向右旋转 3 步: [5, 6, 7, 1, 2, 3, 4]

示例2:
输入: [-1, -100, 3, 99] 和 k = 2
输出: [3, 99, -1, -100]
解释: 
向右旋转 1 步: [99, -1, -100, 3]
向右旋转 2 步: [3, 99, -1, -100]
```

``` js
function rotate(arr, k) {
  const len = arr.length
  const step = k % len // 步数有可能大于数组长度，先取余
  return arr.slice(-step).concat(arr.slice(0, len - step))
}
```

## 78. [Vue 的父组件和子组件生命周期钩子执行顺序是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/128)

* 加载渲染过程

父 beforeCreate -> created-> beforeMount ->

子 beforeCreate -> created-> beforeMount-> mounted->

父 mounted

* 子组件更新过程

父 beforeUpdate-> 子 beforeUpdate -> 子 updated -> 父 updated

* 父组件更新过程

父 beforeUpdate -> 父 updated

* 销毁过程

父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

总结：从外到内，再从内到外

## 79. [input 搜索如何防抖，如何处理中文输入](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/129)

* 切换中文输入法后在打拼音时 (此时 input 内还没有填入真正的内容)，会首先触发 compositionstart 事件
* 然后每打一个拼音字母，触发 compositionupdate 事件
* 最后将输入好的中文填入 input 中时触发 compositionend 事件

## 80. [介绍下 Promise.all 使用、原理实现及错误处理](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/130)

``` js
all(list) {
  return new Promise((resolve, reject) => {
    let resValues = []
    let counts = 0
    for (let [i, p] of list) {
      resolve(p).then(res => {
        counts++
        resValues[i] = res
        if (counts === list.length) {
          resolve(resValues)
        }
      }, err => {
        reject(err)
      })
    }
  })
}
```

* 有一个任务出错，Promise.all 便会 reject
* 可使任务始终 resolve，通过返回值判决是否成功
