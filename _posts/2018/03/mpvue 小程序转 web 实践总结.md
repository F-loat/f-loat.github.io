---
category: 文章
tags:
  - 前端
  - 小程序
date: 2018-03-26
title: MPVue 小程序转 Web 实践总结
---

> [MPVue](https://github.com/Meituan-Dianping/mpvue) 是一个使用 Vue.js 开发小程序的前端框架。框架基于 Vue.js 核心，修改了 Vue.js 的 runtime 和 compiler 实现，使其可以运行在小程序环境中，从而为小程序开发引入了整套 Vue.js 开发体验，同样也使得一套代码同时复用在小程序和 Web 中成为可能。

<!-- more -->

## 概述

本文将以 [IT之家Lite](https://github.com/F-loat/ithome-lite) 小程序的 Web 转换经过为线索，大致介绍一下转换的基本步骤及需要注意的一些事项。

## 目录结构

> 省略了部分与转换无关的文件

```
├─build
├─config
├─src
│ ├─components
│ ├─pages
│ ├─store
│ ├─styles
│ ├─utils
│ │  ├─api.js
│ │  ├─index.js
│ │  ├─request.js
│ │  └─wx.js
│ ├─App.vue
│ └─main.js
├─package-lock.json
└─package.json
```

## 转换步骤

0.前期准备

* 建议使用 git 进行分支管理
* 尽量避免使用不必要的小程序特有标签，如 text，image 等 [#9137744](https://github.com/F-loat/ithome-lite/commit/9137744e25000cbaa82529639976b3ddea3b5f1b)
* 避免直接使用 wx 对象，使用 `import wx from 'wx'` 的方式引入，便于 web 中改写 [#c3ef6e7](https://github.com/F-loat/ithome-lite/commit/c3ef6e771dc6e767fed9316fd62bed53581763f2)
``` js
// src/utils/wx.js
export default wx
```
* 使用 [flyio](https://github.com/wendux/fly) 作为请求库，配置 alias 将 flyio 指向 `flyio/dist/npm/wx`
* 基于原分支新建 web-version 分支

1.修改打包配置

* 可以在原有配置基础上修改，主要涉及 entry、target 及 loader 相关的配置项，这里我直接通过 vue-cli 生成了一个新的项目，复制 build、config 文件夹及 eslint、babel 等的配置文件替换原有配置，使用新项目的 package.json 并做相应修改，新建项目时各选项尽量与原项目保持一致 [#ece3a76](https://github.com/F-loat/ithome-lite/commit/ece3a76590df79a3ee19e2fa0a4c7ce07cb77227)
* 修改 main.js，指定挂载元素，顺利的话，这步之后执行 `npm run dev` 便已经可以跑起来了，有报错的话解决相应错误即可

2.配置路由

* 添加 vue-router，并进行相应配置，建议使用 history 模式 [#ddf94bc](https://github.com/F-loat/ithome-lite/commit/ddf94bca7d432ee7ac436f74ed27b4d6bf482e6e)
* 修改路由参数获取相关的代码 [#b949197](https://github.com/F-loat/ithome-lite/commit/b9491979a07940cfb9dd690fb26833cc71d0184d)
* 使用 router-link 替换 a 标签，避免页面重载 [#eb09297](https://github.com/F-loat/ithome-lite/commit/eb092972647bb6d903f02bba3c6e38335d1b8b90)

3.调整请求接口

* 配置 alias 将 flyio 指向 `flyio/dist/npm/fly`
* 小程序中不会有跨域的问题，但 web 中需配合后端进行请求转发或通过其他方式来解决这一问题 [#f963975](https://github.com/F-loat/ithome-lite/commit/f96397539da68b31d05bc7c84b9208b565d3fc55)

4.转换小程序组件及 API

* 底部导航栏，自己布局实现 [#8d6d98b](https://github.com/F-loat/ithome-lite/commit/8d6d98bb477cd001c1f0168b5b13e7a77bdf56cb)
``` pug
.nav(v-if="$route.meta.nav")
  a.nav-item(href="/pages/news/list")
    img.nav-icon(v-if="$route.name === 'NewsList'", src="/static/assets/news-active.png")
    img.nav-icon(v-else, src="/static/assets/news.png")
    .nav-title(:class="{ active: $route.name === 'NewsList' }") 资讯
  a.nav-item(href="/pages/quanzi/list")
    img.nav-icon(v-if="$route.name === 'QuanziList'", src="/static/assets/quanzi-active.png")
    img.nav-icon(v-else, src="/static/assets/quanzi.png")
    .nav-title(:class="{ active: $route.name === 'QuanziList' }") 圈子
```

* rich-text 组件，使用 v-html 实现 [#1945f3f](https://github.com/F-loat/ithome-lite/commit/1945f3f7bbe62b9a6913701910775739ac433909)
* swiper 组件，使用 [vue-swiper-component](https://github.com/zwhGithub/vue-swiper) 实现 [#f4a4e1a](https://github.com/F-loat/ithome-lite/commit/f4a4e1a094d08a274782ef19e0e5361f5d546557)
* toast 及 loading 接口，使用 [vue2-toast](https://github.com/lin-xin/vue-toast) 实现 [#cb1d9d3](https://github.com/F-loat/ithome-lite/commit/cb1d9d3f75e9fbf42d2b98f80a51e124de52a38c)
``` js
// src/utils/wx.js
import Vue from 'vue'

export default {
  showNavigationBarLoading () {
    Vue.prototype.$loading('加载中')
  },
  hideNavigationBarLoading () {
    Vue.prototype.$loading.close()
  },
  showToast ({ title }) {
    Vue.prototype.$toast.center(title)
  }
}
```
* 下拉刷新及上拉加载，使用 [vue-pull-to](https://github.com/stackjie/vue-pull-to) 实现 [#e23b810](https://github.com/F-loat/ithome-lite/commit/e23b81067ceca02c43c673eac710b853911afeee)
``` pug
#app
  pull-to(
    ref="scroller",
    :top-load-method="refresh",
    :bottom-load-method="loadmore",
    :is-top-bounce="!!onPullDownRefresh",
    :is-bottom-bounce="!!onReachBottom",
    @scroll="saveScrollPosition")
    keep-alive
      router-view(ref="current")
```
``` js
import PullTo from 'vue-pull-to'
export default {
  name: 'App',
  mpType: 'app',
  components: {
    PullTo
  },
  data () {
    return {
      onPullDownRefresh: null,
      onReachBottom: null
    }
  },
  methods: {
    async refresh (loaded) {
      await this.onPullDownRefresh.call(this.$refs.current)
      loaded()
    },
    async loadmore (loaded) {
      await this.onReachBottom.call(this.$refs.current)
      loaded()
    },
    saveScrollPosition (e) {
      const { current } = this.$refs
      current.scrollTop = e.srcElement.scrollTop
    }
  },
  watch: {
    $route () {
      this.$nextTick(() => {
        const { current } = this.$refs
        if (!current) return
        this.onPullDownRefresh = current.$options.onPullDownRefresh
        this.onReachBottom = current.$options.onReachBottom
      })
    }
  }
}
```

5.Web 优化

* 使用 [minireset](https://github.com/jgthms/minireset.css) 重置浏览器默认样式，部分标签在小程序中的默认样式与浏览器不同，也需进行处理 [#e98f5ba](https://github.com/F-loat/ithome-lite/commit/e98f5ba8cdced6cbe0c9a14beb22ecd457884123)
* 引入 [babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill)，提高兼容性 [#c184166](https://github.com/F-loat/ithome-lite/commit/c1841663bf56c308229380f4400bd68b4c54b2b3)

## 维护

在初步完成 Web 版的转换之后，便可以再次切换回主分支，后续的 feature 及 bugfix 均在主分支进行，待主分支发版后切换到 web 分支进行一次合并操作，可能会产生少量冲突，但也都会比较容易解决，最后处理下新引入的小程序特性即可，整体而言可维护性还是比较好的

## 总结

整个转换过程还是比较顺利的，主体部分约 1 个多小时完成，相对于小程序，web 的环境更为开放，所以大部分小程序的 api 可以通过各种方式模拟，由于是在两个不同的分支进行，也可以放心地使用各种浏览器端的特性，但是样式及脚本尽量不要直接修改原有代码，可通过 mixin、新建 style 标签等方式实现，避免造成冲突

## 展望

* 双端统一的 UI 库，目前来看只能使用一些简单的 css 类库
* 更好的路由支持，理想状态下，可以通过 vue-router 的配置文件自动生成各页面的 main.js 文件，并配置 entry，开发 .vue 文件时，可以直接使用 `this.$route` `this.$router` 及 `router-link` 完成相关操作，避免每次手动修改

## 附

1. Git 仓库

* IT之家Lite：[ithome-lite](https://github.com/F-loat/ithome-lite)
* MPVue：[mpvue](https://github.com/Meituan-Dianping/mpvue)
* 项目模版：[mpvue-quickstart](https://github.com/F-loat/mpvue-quickstart)
* 配置优化：[mpvue-entry](https://github.com/F-loat/mpvue-entry)
* 路由兼容（谨慎使用）：[mpvue-router-patch](https://github.com/F-loat/mpvue-router-patch)
* 打包工具（已支持 web 打包）：[mpvue-packager](https://github.com/F-loat/mpvue-packager)

2. Demo

* IT之家Lite Web 版: [http://ithome.f-loat.xyz](http://ithome.f-loat.xyz)
