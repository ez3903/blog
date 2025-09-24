import { defineConfig } from "vitepress";
import { createNav, createSideBar } from "./navigation.mts";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "鱼叔前端",
  description: "前端学习过程中的笔记",
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/doc/logo.svg",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: createNav(),
    sidebar: createSideBar(),
    logo: "/logo.svg",
    socialLinks: [
      { icon: "github", link: "https://github.com/ez3903/blog.git" },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },
    lastUpdated: {
      text: "更新时间",
      formatOptions: {
        dateStyle: "medium",
        timeStyle: "medium",
      },
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Evan You",
    },
    docFooter: { prev: "上一篇", next: "下一篇" },
    siteTitle: false,
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    outline: { label: "页面导航", level: "deep" },
  },
  base: "/doc/",
  srcDir: "./docs",
  lastUpdated: true,
  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },

});