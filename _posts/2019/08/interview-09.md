---
category: 笔记
tags:
  - 前端
  - 面试
date: 2019-08-13
title: 前端 100 问 (九)
---

81. 打印出 1 - 10000 之间的所有对称数
82. 周一算法题之「移动零」
83. var、let 和 const 区别的实现原理是什么
84. 请实现一个 add 函数，满足以下功能
85. react-router 里的 Link 标签和 a 标签有什么区别
86. （京东、快手）周一算法题之「两数之和」
87. 在输入框中如何判断输入的是一个正确的网址
88. 实现 convert 方法，把原始 list 转换成树形结构，要求尽可能降低时间复杂度
89. 设计并实现 Promise.race()
90. 实现模糊搜索结果的关键词高亮显示

<!-- more -->

## 81. [打印出 1 - 10000 之间的所有对称数](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/131)

列出所有位数的对称数，例如1位数的对称数， 2位数的对称数...到4位数

* i
* i*11
* i\*101 + j\*10
* ...

## 82. [周一算法题之「移动零」](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/132)

> 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序

示例:

```
输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
```

说明:

1. 必须在原数组上操作，不能拷贝额外的数组
2. 尽量减少操作次数

思路：双指针

> 设定一个慢指针一个快指针，快指针每次+1， 当慢指针的值不等于0的时候也往后移动，当慢指针等于0并且快指针不等于0的时候，交换快慢指针的值，慢指针再+1

## 83. [var、let 和 const 区别的实现原理是什么](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/133)



## 84. [请实现一个 add 函数，满足以下功能](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/134)

``` js
add(1) // 1
add(1)(2) // 3
add(1)(2)(3) // 6
add(1)(2, 3) // 6
add(1, 2)(3) // 6
add(1, 2, 3) // 6
```

* 重写 toString 方法，使得 return 一个函数的同时可以输出结果

## 85. [react-router 里的 Link 标签和 a 标签有什么区别](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/135)

> 如何禁掉 a 标签默认事件，禁掉之后如何实现跳转

Link 点击事件 handleClick 部分源码

``` js
if (_this.props.onClick) _this.props.onClick(event)

if (!event.defaultPrevented && // onClick prevented default
event.button === 0 && // ignore everything but left clicks
!_this.props.target && // let browser handle "target=_blank" etc.
!isModifiedEvent(event) // ignore clicks with modifier keys
) {
    event.preventDefault()

    const history = _this.context.router.history
    const _this$props = _this.props,
        replace = _this$props.replace,
        to = _this$props.to

    if (replace) {
      history.replace(to)
    } else {
      history.push(to)
    }
  }
```

## 86. [（京东、快手）周一算法题之「两数之和」](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/136)

> 给定一个整数数组和一个目标值，找出数组中和为目标值的两个数

示例：

```
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

``` js
arr.findIndex(x => x === target - cur)
```

## 87. [在输入框中如何判断输入的是一个正确的网址](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/138)

* 正则
* `new URL(url)`

## 88. [实现 convert 方法，把原始 list 转换成树形结构，要求尽可能降低时间复杂度](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/139)

``` js
// 原始 list 如下
const list = [
  { id: 1, name: '部门A', parentId: 0 },
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 }
]
const result = convert(list, ...)

// 转换后的结果如下
[
  {
    id: 1,
    name: '部门A',
    parentId: 0,
    children: [
      {
        id: 3,
        name: '部门C',
        parentId: 1,
        children: [
          {
            id: 6,
            name: '部门F',
            parentId: 3
          }, {
            id: 16,
            name: '部门L',
            parentId: 3
          }
        ]
      },
      {
        id: 4,
        name: '部门D',
        parentId: 1,
        children: [
          {
            id: 8,
            name: '部门H',
            parentId: 4
          }
        ]
      }
    ]
  },
  ···
]
```

* 使用 Map 保存 id 和对象的映射
* 循环 list，根据 parentId 在 Map 里取得父节点
* 如果父节点为 0 就把当前节点保存到结果中
* 如果父节点有 children 属性，就直接 push 当前的子节点，如果没有就添加 children 属性

## 89. [设计并实现 Promise.race()](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/140)

``` js
Promise._race = promises => new Promise((resolve, reject) => {
	promises.forEach(promise => {
		promise.then(resolve, reject)
	})
})
```

## 90. [实现模糊搜索结果的关键词高亮显示](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/141)

* 正则匹配替换
* 节流、缓存
* 列表 diff、定时清理缓存
