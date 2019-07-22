module.exports = {
  // 网站 Title
  title: 'F-loat',

  // 网站描述
  description: 'This is my blog',

  // 网站元信息
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  // 网站语言
  locales: {
    '/': {
      lang: 'zh-CN',
    },
  },
  
  // 插件
  plugins: [
    ['@vuepress/google-analytics', {
      'ga': 'UA-98660473-2',
    }],
  ],

  // 主题
  theme: 'meteorlxy',

  // 主题配置
  themeConfig: {
    // 主题语言，参考下方 [主题语言] 章节
    lang: 'zh-CN',

    // 个人信息（没有或不想设置的，删掉对应字段即可）
    personalInfo: {
      // 昵称
      nickname: '徒言',

      // 个人简介
      description: 'Happy Coding<br/>Happy Life',

      // 电子邮箱
      email: 'chaimaoyuan@foxmail.com',

      // 所在地
      location: 'Tian\'jin City, China',

      // 组织
      organization: 'Youngon',

      // 头像
      avatar: 'https://avatars2.githubusercontent.com/u/16759376?s=460&v=4',

      // 社交平台帐号信息
      sns: {
        // Github 帐号和链接
        github: {
          account: 'F-loat',
          link: 'https://github.com/F-loat',
        },

        // Facebook 帐号和链接
        facebook: {
          account: 'chaimaoyuan',
          link: 'https://www.facebook.com/chaimaoyuan',
        },

        // LinkedIn 帐号和链接
        linkedin: {
          account: '柴茂源',
          link: 'http://www.linkedin.com/in/茂源-柴-a9b290115/',
        },

        // Twitter 帐号和链接
        twitter: {
          account: 'chaimaoyuan',
          link: 'https://twitter.com/chaimaoyuan',
        },

        // 知乎 帐号和链接
        zhihu: {
          account: 'F-loat',
          link: 'https://www.zhihu.com/people/F-loat',
        },

        // Instagram 帐号和链接
        instagram: {
          account: 'chaimaoyuan',
          link: 'https://www.instagram.com/chaimaoyuan',
        },

        // GitLab 帐号和链接
        gitlab: {
          account: 'F-loat',
          link: 'https://gitlab.com/F-loat',
        },
      },
    },

    // 上方 header 的相关设置
    header: {
      // header 的背景，可以使用图片，或者随机变化的图案（geopattern）
      background: {
        // 使用随机变化的图案，如果设置为 false，且没有设置图片 URL，将显示为空白背景
        useGeo: true,
      },

      // 是否在 header 显示标题
      showTitle: true,
    },

    // 是否显示文章的最近更新时间
    lastUpdated: true,

    // 顶部导航栏内容
    nav: [
      { text: '首页', link: '/', exact: true },
      { text: '文章', link: '/posts/', exact: false },
    ],

    // 评论配置
    comments: {
      owner: 'F-loat',
      repo: 'f-loat.github.io',
      clientId: '61c69dcfc71544b86cda',
      clientSecret: '684104989787ca7e1232d30273284da88e15695e',
    },

    // 分页配置
    pagination: {
      perPage: 5,
    },

    // 默认页面（可选，默认全为 true）
    defaultPages: {
      // 是否允许主题自动添加 Home 页面 (url: /)
      home: true,
      // 是否允许主题自动添加 Posts 页面 (url: /posts/)
      posts: true,
    },
  },
}
