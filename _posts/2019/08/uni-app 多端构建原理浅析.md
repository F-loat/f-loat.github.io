---
category: 文章
tags:
  - 前端
  - 小程序
date: 2019-08-03
title: uni-app 多端构建原理浅析
---

> uni-app 是一个使用 [Vue.js](https://vuejs.org) 开发所有前端应用的框架，开发者编写一套代码，可编译到 iOS、Android、H5、以及各种小程序等多个平台。即使不跨端，uni-app 同时也是更好的小程序开发框架。

<!-- more -->

## 概述

本文主要针对 uni-app 的构建逻辑进行介绍，即主要涉及 vue-cli 及 webpack 的相关知识，对其本身的运行逻辑不做深入讨论

## 项目结构

uni-app 支持通过 [可视化界面](https://uniapp.dcloud.io/quickstart?id=_1-通过-HBuilderX-可视化界面)、[vue-cli命令行](https://uniapp.dcloud.io/quickstart?id=_2-通过vue-cli命令行) 两种方式快速创建项目，通过 HbuilderX 创建的项目相当于只保留了常规 vue 项目的 src 目录

* 优点是，最大程度上屏蔽了各种构建配置及项目依赖的处理，项目极为简洁，且对新手非常友好
* 缺点是，降低了开发者一定的自由度，例如不便于使用 vscode 之类的第三方编辑器，开发者无法自由控制依赖及无法微调构建配置等

两种方式创建的项目相互转换也较为简单，本文将以命令行创建的项目为主进行介绍，同时在必要时说明两者差异，具体文件结构如下

```
project
├── dist
├── node_modules
├── public
├── src
│   ├── pages
│   │   └── index
│   │      └── index.vue
│   ├── static
│   ├── App.vue
│   ├── main.js
│   ├── manifest.json
│   ├── pages.json
│   └── uni.scss
├── .gitignore
├── babel.config.js
├── package.json
├── postcss.config.js
└── README.md
```

## 依赖说明

> 本文基于以下版本依赖编写，下方依赖均采用 [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0.html) 开源协议

* dependencies 中的各项依赖为 uni-app 针对不同平台的运行时，主要用于抹平 UI 及 API 差异
* devDependencies 中的各项依赖为 uni-app 的构建插件，主要用于调整 webpack 配置及构建流程

``` json
{
  "dependencies": {
    "@dcloudio/uni-app-plus": "0.0.248",
    "@dcloudio/uni-h5": "0.7.3",
    "@dcloudio/uni-mp-alipay": "0.0.822",
    "@dcloudio/uni-mp-baidu": "0.0.852",
    "@dcloudio/uni-mp-qq": "0.0.106",
    "@dcloudio/uni-mp-toutiao": "0.0.346",
    "@dcloudio/uni-mp-weixin": "0.0.967",
  },
  "devDependencies": {
    "@dcloudio/uni-cli-shared": "0.2.973", // 公共工具类函数
    "@dcloudio/uni-template-compiler": "0.9.180",
    "@dcloudio/vue-cli-plugin-hbuilderx": "1.0.124", // app-plus 相关逻辑处理
    "@dcloudio/vue-cli-plugin-uni": "0.9.500", // 构建核心
    "@dcloudio/vue-cli-plugin-uni-optimize": "0.1.4", // h5 发行模式优化
    "@dcloudio/webpack-uni-mp-loader": "0.3.639", // 小程序单文件组件解析
    "@dcloudio/webpack-uni-pages-loader": "0.2.856" // pages.json 解析转换
  }
}
```

## 构建命令

### uni-app 构建命令

``` sh
# h5 平台的开发模式
cross-env NODE_ENV=development UNI_PLATFORM=h5 vue-cli-service uni-serve
# 其他平台的开发模式
cross-env NODE_ENV=development UNI_PLATFORM=platform vue-cli-service uni-build --watch

# 所有平台的生产模式
cross-env NODE_ENV=production UNI_PLATFORM=platform vue-cli-service uni-build
```

uni-app 的构建基于 vue-cli 的插件体系开发而成，可以看到，在构建命令中主要做了以下两件事

* 对 `NODE_ENV` 及 `UNI_PLATFORM` 两个环境变量进行设置
* 调用了 `vue-cli-service uni-*` 这一命令

### vue-cli 插件简介

> 仅对 vue-cli 的 Service 插件做简单介绍，完整文档可以点击[这里](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html)查看

使用 vue-cli 初始化的项目，会在局部安装 `@vue/cli-service`，暴露出以下命令

``` sh
vue-cli-service <command> [...args]
```

每当调用 `vue-cli-service` 命令时，会自动加载 `package.json` 中所有名为 `vue-cli-plugin-<name>` 包中的 service 插件 (即 index.js)，service 插件可以修改 webpack 的配置及注入新的命令，上文中的 `uni-serve`，`uni-build` 及 `@vue/cli-service` 内建的 [`serve`](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/commands/serve.js) 等命令均是通过此方式注入

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
const initServeCommand = require('./commands/serve')
const initBuildCommand = require('./commands/build')

module.exports = (api, options) => {
  initServeCommand(api, options)
  initBuildCommand(api, options)
  // ...
}

// @dcloudio/vue-cli-plugin-uni/commands/serve.js
module.exports = (api, options) => {
  api.registerCommand('uni-serve', {
    description: 'start development server',
    usage: 'vue-cli-service uni-serve [options] [entry]',
    options: {
      '--open': `open browser on server start`,
      '--copy': `copy url to clipboard on server start`,
      '--mode': `specify env mode (default: development)`,
      '--host': `specify host (default: ${defaults.host})`,
      '--port': `specify port (default: ${defaults.port})`,
      '--https': `use https (default: ${defaults.https})`,
      '--public': `specify the public network URL for the HMR client`
    }
  }, async (args) => {/*...*/})
}

// @dcloudio/vue-cli-plugin-uni/commands/build.js
module.exports = (api, options) => {
  api.registerCommand('uni-build', {
    description: 'build for production',
    usage: 'vue-cli-service uni-build [options]',
    options: {
      '--watch': `watch for changes`,
      '--minimize': `Tell webpack to minimize the bundle using the TerserPlugin.`
    }
  }, async (args) => {/*...*/})
}
```

## 核心逻辑

`@dcloudio/vue-cli-plugin-uni` 是 uni-app 整个构建体系的核心，主要文件结构如下

```
@dcloudio/vue-cli-plugin-uni
├── commands
│   ├── build.js
│   ├── info.js
│   └── servr.js
├── lib
│   ├── app-plus
│   ├── h5
│   ├── mp-alipay
│   ├── mp-baidu
│   ├── ...
│   └── mp.js
├── packages
│   ├── @megalo
│   ├── h5-vue
│   ├── mp-vue
│   ├── mpvue
│   ├── ...
│   └── webpack-scoped-loader
├── util
├── generator.js
├── index.js
└── ui.js
```

执行 `vue-cli-service` 后，自动调用 `index.js`，进行以下主要处理步骤

* 注册构建命令
* 初始化环境变量
* 合并 `libs` 中的目标平台构建配置

> 通过 `UNI_PLATFORM` 控制引用的配置文件，但实际上 App 及各小程序平台均直接使用了 `lib/mp.js`

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
const platformOptions = require('./lib/' + process.env.UNI_PLATFORM)

// @dcloudio/vue-cli-plugin-uni/lib/app-plus.js
const mp = require('../mp')
module.exports = mp
```

* 修改 alias，loaders 及 plugins 等配置

> 通过 alias 配置将 vue 等第三方依赖链接到 `packages` 目录中的修改版本

## 构建入口

> 构建入口是 webpack 整个构建流程的起始，uni-app 对于构建入口的处理也较为巧妙

### H5

普通 vue 项目的构建入口相对比较简单，整个应用只需要一个入口文件即可

``` js
// @dcloudio/uni-cli-shared/lib/pages.js
function getMainEntry () {
  if (!mainEntry) {
    mainEntry = fs.existsSync(path.resolve(process.env.UNI_INPUT_DIR, 'main.ts')) ? 'main.ts' : 'main.js'
  }
  return mainEntry
}

// @dcloudio/vue-cli-plugin-uni/lib/h5/index.js
const vueConfig = {
  // ...
  pages: {
    index: {
      entry: path.resolve(process.env.UNI_INPUT_DIR, getMainEntry()),
      // ...
    }
  }
}
```

### 其他平台

接触过 [mpvue](https://github.com/Meituan-Dianping/mpvue) 或者 [megalo](https://github.com/kaola-fed/megalo) 的同学可能清楚，对于小程序的构建，每个页面都需要单独的一个入口文件，且入口文件内容基本一致，存在一定的冗余，这两个框架也都有相应的优化措施

* mpvue 可以通过 [mpvue-entry](https://github.com/F-loat/mpvue-entry) 实现单一入口，并在 `app.json` 中统一配置各页面的 config
* megalo 则在 [@megalo/target](http://megalojs.org/#/basic/file?id=优化结构) 的 0.4.10 后的版本直接支持了以 vue 文件作为入口，页面的 config 同样在 vue 文件中配置

而 uni-app 的处理方式与 mpvue 较为一致，但实现上优雅很多，uni-app 所有页面的 config 均在 `pages.json` 中配置，构建入口均为 `src/main.js` 这个文件，通过传入不同的参数配合自定义 loader 来实现对不同页面的构建，同时根据构建模式的不同会输出三种不同的入口内容

``` js
// @dcloudio/vue-cli-plugin-uni/lib/mp.js
module.exports = {
  // ...
  webpackConfig (webpackConfig) {
    // ...
    parseEntry()
    // ...
    return {
      // ...
      entry () {
        return process.UNI_ENTRY
      },
      // ...
      module: {
        rules: [{
          // 自定义 main.js 解析 loader
          test: path.resolve(process.env.UNI_INPUT_DIR, getMainEntry()),
          use: [{
            loader: '@dcloudio/webpack-uni-mp-loader/lib/main'
          }]
        }],
      },
      // ...
    }
  }
}

// @dcloudio/uni-cli-shared/lib/pages.js
function parseEntry (pagesJson) {
  process.UNI_ENTRY = {
    'common/main': path.resolve(process.env.UNI_INPUT_DIR, getMainEntry())
  }
  // ...
  if (!pagesJson) {
    pagesJson = getPagesJson()
  }
  pagesJson.pages.forEach(page => {
    // key 为 pages/index/index
    // value 为 绝对路径 file:/project/src/main.js?{"page":"pages%2Findex%2Findex"}
    process.UNI_ENTRY[page.path] = getMainJsPath(page.path)
  })
  // ...
}

// @dcloudio/webpack-uni-mp-loader/lib/main.js
module.exports = function (content) {
  // 自定义组件模式
  if (process.env.UNI_USING_COMPONENTS) {
    return require('./main-new').call(this, content)
  }
  // template 模式
  if (this.resourceQuery) {
    // ...
    return (process.env.UNI_PLATFORM === 'mp-weixin' || process.env.UNI_PLATFORM === 'app-plus')
        ? getMPVuePageFactoryMainJsCode(params) : getNormalMainJsCode(params)
  } else {
    // 主入口，会做一些全局组件的解析
  }
}

function getNormalMainJsCode (params) {
  // 常规页面入口文件
  return `import App from './${normalizePath(params.page)}.vue'
import Vue from 'vue'
App.mpType='page'
const app = new Vue(App)
app.$mount()`
}

function getMPVuePageFactoryMainJsCode (params) {
  // 使用 mpvue-page-factory 解决 mpvue#140
  return `import pageFactory from 'mpvue-page-factory'
    import App from './${normalizePath(params.page)}.vue'
    Page(pageFactory(App))`
}

// @dcloudio/webpack-uni-mp-loader/lib/main-new.js
module.exports = function (content) {
  if (this.resourceQuery) {
    // ...
    return `
import Vue from 'vue'            
import Page from './${normalizePath(params.page)}${ext}'
createPage(Page)
`
  } else {/*...*/}
}
```

## 公共配置

| 环境变量 | 典型值 | 说明 |
|:-:|:-:|:-:|
| NODE_ENV | `'development'` | 构建模式 |
| UNI_PLATFORM | `'mp-weixin'` | 构建平台 |
| UNI_INPUT_DIR | `'file:/project/src'` | 输入目录 |
| UNI_OUTPUT_DIR | `'file:/project/dist'` | 输出目录 |
| UNI_OUTPUT_TMP_DIR | `'file:/project/.tmp/app-plus'` | 缓存目录 |
| UNI_CLI_CONTEXT | `'file:/project'` | 项目根目录 |
| UNI_USING_COMPONENTS | `true` | vue 编译模式 |
| UNI_USING_NVUES | `false` | - |
| UNI_USING_NVUE_COMPILER | `false` | nvue 编译模式 |
| UNI_USING_V8 | `true` | - |
| UNI_OPT_COMPONENT | `true` | h5 优化 |
| UNI_OPT_PREFETCH | `true` | h5 优化 |
| UNI_OPT_PRELOAD | `true` | h5 优化 |
| VUE_APP_DEBUG | `false` | debug 模式 |
| VUE_APP_PLATFORM | 同 `UNI_PLATFORM` | 构建平台 |

以上变量主要用于构建时进行各种判断，从而对构建配置进行所需的修改，稍加了解对代码的阅读会有一定帮助，部分变量可在 `manifest.json` 中配置，部分可通过外部环境变量覆盖

客户端侧各平台均能访问的环境变量仅有 `BASE_URL`，`NODE_ENV`，`VUE_APP_PLATFORM` 及 `UNI_ENV`，其中前三个是 vue-cli [自动注入](https://cli.vuejs.org/zh/guide/mode-and-env.html#在客户端侧代码中使用环境变量)的，最后一个由 `@dcloudio/vue-cli-plugin-uni` 注入，值同 `UNI_PLATFORM`，同时 uni-app 官方也不推荐使用环境变量来判断不同平台，而是使用[条件编译](https://uniapp.dcloud.io/platform)

### Alias

* 将 `template-compiler` 指向修订后的版本，这两个包会在构建过程中调用，所以需要借助 `module-alias` 进行处理

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
const moduleAlias = require('module-alias')

moduleAlias.addAlias('@megalo/template-compiler', '@dcloudio/vue-cli-plugin-uni/packages/@megalo/template-compiler')
moduleAlias.addAlias('mpvue-template-compiler', '@dcloudio/vue-cli-plugin-uni/packages/mpvue-template-compiler')
```

* webpack 的 alias 配置中，vue 指向了 `getPlatformVue()` 这个函数，当使用[自定义组件模式](https://ask.dcloud.net.cn/article/35843)时，会始终返回 `uniRuntime`，否则默认情况如下表

| 运行时 | 平台 |
|:-:|:-:|
| vueRuntime | `h5` |
| mpvueRuntime | `app-plus, mp-qq, mp-weixin` |
| megaloRuntime | `mp-baidu, mp-alipay, mp-toutiao` |

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
module.exports = (api, options) => {
  // ...
  api.configureWebpack(webpackConfig => {
    // ...
    return merge({
      resolve: {
        alias: {
          '@': path.resolve(process.env.UNI_INPUT_DIR),
          'vue$': getPlatformVue(),
          'uni-pages': path.resolve(process.env.UNI_INPUT_DIR, 'pages.json')
        },
        // ...
      },
      // ...
    }, platformWebpackConfig)
  })
  // ...
}

// @dcloudio/uni-cli-shared/lib/platform.js
const uniRuntime = '@dcloudio/vue-cli-plugin-uni/packages/mp-vue'
const mpvueRuntime = '@dcloudio/vue-cli-plugin-uni/packages/mpvue'
const megaloRuntime = '@dcloudio/vue-cli-plugin-uni/packages/megalo'

const PLATFORMS = {
  'h5': {
    global: '',
    exts: false,
    vue: '@dcloudio/vue-cli-plugin-uni/packages/h5-vue',
    compiler: false,
    megalo: false,
    subPackages: false,
    cssVars: {
      '--status-bar-height': '0px'
    }
  },
  // ...
}

module.exports = {
  // ...
  getPlatformVue () {
    if (process.env.UNI_USING_COMPONENTS) {
      return uniRuntime
    }
    return platform.vue
  },
  // ...
}
```

### Loaders

* sass-loader

uni-app 会自动判断是否存在 `src/uni.scss` 这个文件，存在则自动注入所有 sass 文件中，实现全局的样式变量的覆盖

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
module.exports = (api, options) => {
  // ...
  options.css.loaderOptions.sass.data = getPlatformScss() // 默认全局样式变量
  if (fs.existsSync(path.resolve(process.env.UNI_INPUT_DIR, 'uni.scss'))) {
    options.css.loaderOptions.sass.data = `${getPlatformScss()}
@import "@/uni.scss";`
  }
  // ...
}
```

* webpack-preprocess-loader

该 loader 用于实现条件编译，uni-app 对几乎所有类型的文件均添加了这一 loader，使得代码的多端兼容极为便捷，其内部通过调用 [preprocess](https://github.com/jsoverson/preprocess) 这个库实现

* webpack-uni-pages-loader

该 loader 作用于 `src/pages.json`，解析生成项目及各页面的 config，并配合 wrap-loader 将转换后的结果引入 `src/main.js` 中

* wrap-loader

该 loader 作用于 `src/main.js`，自动引入各平台运行时兼容

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
module.exports = (api, options) => {
  // ...
  api.configureWebpack(webpackConfig => {
    // ...
    const rules = [
      // ...
      {
        test: path.resolve(process.env.UNI_INPUT_DIR, getMainEntry()),
        use: [{
          loader: 'wrap-loader',
          options: {
            before: [
              process.env.UNI_PLATFORM === 'h5'
                ? ((useBuiltIns === 'entry' ? `import '@babel/polyfill';` : '') +
                  `import 'uni-pages';import 'uni-${process.env.UNI_PLATFORM}';`)
                : `import 'uni-pages';`
            ]
          }
        }]
      },
      // ...
    ]
```

### Plugins

* CopyWebpackPlugin 复制 static 文件夹到输出目录

* DefinePlugin 定义客户端侧全局常量 `process.env.UNI_ENV`

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
module.exports = (api, options) => {
  // ...
  api.chainWebpack(webpackConfig => {
    // ...
    webpackConfig
      .plugin('uni-define')
      .use(require.resolve('webpack/lib/DefinePlugin'), [{
        'process.env.UNI_ENV': JSON.stringify(process.env.UNI_PLATFORM)
      }])
  })
}
```

## 各端兼容

### H5

* Alias

``` js
// @dcloudio/vue-cli-plugin-uni/lib/h5/index.js
'vue-router': resolve('packages/h5-vue-router'),
'uni-h5': require.resolve('@dcloudio/uni-h5'),
'vue-style-loader': resolve('packages/h5-vue-style-loader')
```

* 解析 pages.json 并转换为 vue-router 配置后挂在全局变量上，供运行时调用

``` js
// @dcloudio/webpack-uni-pages-loader/lib/platforms/h5.js
module.exports = function (pagesJson, manifestJson) {
  // ...
  return `  
import Vue from 'vue'
global.__uniConfig = ${JSON.stringify(pagesJson)}
global.__uniConfig.router = ${JSON.stringify(h5.router)};
global.__uniConfig['async'] = ${JSON.stringify(h5['async'])};  
global.__uniConfig.debug = ${manifestJson.debug === true};
global.__uniConfig.networkTimeout = ${JSON.stringify(networkTimeoutConfig)};
global.__uniConfig.sdkConfigs = ${JSON.stringify(sdkConfigs)};
global.__uniConfig.qqMapKey = ${JSON.stringify(qqMapKey)};
global.__uniConfig.nvue = ${JSON.stringify({ 'flex-direction': getFlexDirection(manifestJson['app-plus']) })}
${genRegisterPageVueComponentsCode(pageComponents)}
global.__uniRoutes=[${genPageRoutes(pageComponents).concat(genSystemRoutes()).join(',')}]
`
}
```

* 开发模式注入 reload 脚本

``` js
// @dcloudio/vue-cli-plugin-uni/lib/h5/index.js
if (process.env.NODE_ENV !== 'production') {
  plugins.push(new WebpackHtmlAppendPlugin(
    `
        <script>
        ${fs.readFileSync(path.resolve(__dirname, './auto-reload.js'), 'utf8')}
        </script>
        `
  ))
}
```

* vue-cli-plugin-uni-optimize 专用于 h5 平台的优化插件

* CopyWebpackPlugin 复制 h5 平台兼容样式到输出目录的 static 文件夹中

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
function getCopyWebpackPluginOptions () {
  // ...
  if (process.env.UNI_PLATFORM === 'h5') {
    appendCopyWebpackPluginOptions(
      options,
      require.resolve('@dcloudio/uni-h5/dist/index.css'),
      assetsDir, {
        transform (content) {
          if (process.env.NODE_ENV === 'production') {
            return content + getShadowCss()
          }
          return content
        }
      }
    )
  }
  // ...
}
```

### 小程序

* 重写 vue scoped，提供了对 scoped 更好的支持

``` js
// @dcloudio/vue-cli-plugin-uni/lib/mp.js
moduleAlias.addAlias('./stylePlugins/scoped', path.resolve(__dirname, './scoped.js'))
```

* 添加 `mpvue-page-factory` 的 alias，通过对构建入口的处理注入，解决 [mpvue#140](https://github.com/Meituan-Dianping/mpvue/issues/140)

``` js
// 仅 mp-weixin
'mpvue-page-factory': require.resolve('@dcloudio/vue-cli-plugin-uni/packages/mpvue-page-factory')
```

* 配置 `@dcloudio/webpack-uni-mp-loader` (构建入口的处理[上文](#其他平台)已做介绍)

``` js
// @dcloudio/vue-cli-plugin-uni/lib/mp.js
rules: [
  // ...
  {
    resourceQuery: /vue&type=template/,
    use: [{
      loader: '@dcloudio/webpack-uni-mp-loader/lib/template'
    }]
  }
]
```

* WebpackUniMPPlugin 调用 `emitFile` 生成构建好的文件

``` js
// @dcloudio/vue-cli-plugin-uni/lib/mp.js
function createUniMPPlugin () {
  if (process.env.UNI_USING_COMPONENTS) {
    const WebpackUniMPPlugin = require('@dcloudio/webpack-uni-mp-loader/lib/plugin/index-new')
    return new WebpackUniMPPlugin()
  }
  const WebpackUniMPPlugin = require('@dcloudio/webpack-uni-mp-loader/lib/plugin')
  return new WebpackUniMPPlugin()
}
```

* [ProvidePlugin](https://webpack.docschina.org/plugins/provide-plugin/) 注入 uni 等全局对象

``` js
// @dcloudio/vue-cli-plugin-uni/lib/mp.js
function getProvides () {
  const uniPath = require.resolve('@dcloudio/uni-' + process.env.UNI_PLATFORM)
  const provides = {
    'uni': [uniPath, 'default']
  }

  if (process.env.UNI_USING_COMPONENTS) {
    provides['createApp'] = [uniPath, 'createApp']
    provides['createPage'] = [uniPath, 'createPage']
    provides['createComponent'] = [uniPath, 'createComponent']
  }

  // TODO 目前依赖库 megalo 通过判断 wx 对象是否存在来识别平台做不同处理
  if (
    process.env.UNI_PLATFORM !== 'mp-qq' &&
        process.env.UNI_PLATFORM !== 'mp-weixin' &&
        process.env.UNI_PLATFORM !== 'app-plus'
  ) { // 非微信小程序，自动注入 wx 对象
    provides['wx'] = provides['uni']
  }
  return provides
}
```

* CopyWebpackPlugin 复制各小程序平台原生自定义组件到输出目录，对应关系如下表

| 目录 | 平台 |
|:-:|:-:|
| wxcomponents | `app-plus, mp-qq, mp-weixin` |
| swancomponents | `mp-baidu` |
| mycomponents | `mp-alipay` |
| ttcomponents | `mp-toutiao` |

``` js
// @dcloudio/vue-cli-plugin-uni/index.js
function getCopyWebpackPluginOptions () {
  // ...
  if (process.env.UNI_PLATFORM === 'mp-baidu') {
    // 百度原生小程序组件
    appendCopyWebpackPluginOptions(
      options,
      path.resolve(process.env.UNI_INPUT_DIR, 'swancomponents'),
      path.resolve(process.env.UNI_OUTPUT_DIR, 'swancomponents')
    )
  }
  // ...
}
```

* 禁用热更新等浏览器端特性

### App Plus

* 待补充

## 总结

uni-app 基于 vue-cli 对多端构建的配置进行了封装，很好地实现了不同平台间的兼容处理，使开发者的使用成本大幅降低，同时构建插件的文件结构及代码逻辑也都有很多值得学习之处

文章内容如有疏漏或错误，敬请斧正。
