import { defineConfig } from 'vitepress'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "鱼叔前端",
  description: "前端学习过程中的笔记",
  srcDir: "./src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    logo: '/fish.svg'
  }
})


function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '首页',
      link: '/index',
      activeMatch: '/index/'
    },
    {
      text: '前端',
      link: '/front',
      activeMatch: '/front'
    },
    { text: '其他', link: '/markdown-examples' },
    {
      text: '测试多级导航',
      items: [
        {
          text: 'childNav1',
          link: '/'
        },
        {
          text: 'childNav2',
          link: '/'
        }
      ]
    }
  ]
}