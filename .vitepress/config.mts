import { defineConfig } from 'vitepress'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "鱼叔前端",
  description: "前端学习过程中的笔记",
  head: [
    ['link', {rel: 'icon', href: '/asset/fish.svg'}]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),
    search: {
      provider: 'local'
    },
    sidebar: sidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ez3903/blog.git' }
    ],
    logo: '/asset/fish.svg',
    lastUpdated: {
      text: '更新时间',
      formatOptions: {
        dateStyle: 'medium',
        // timeStyle: 'medium'
      }
    }
  },
  srcDir: './docs',
})

function sidebar() :DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Examples',
      items: [
        { text: 'Markdown Examples', link: '/examples/markdown-examples' },
        { text: 'Runtime API Examples', link: '/examples/api-examples' }
      ]
    },
    {
      text: 'Git',
      items: [
        { text: 'Git基础', link: '/gitDoc/gitBase' },
        { text: 'GitHub', link: '/gitDoc/githubD' },
      ]
    },
  ]
}

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