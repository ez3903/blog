import type { DefaultTheme } from "vitepress";

const feMenu = {
  text: "前端",
  items: [
    { text: "Git笔记", link: "/fe/git" },
    { text: "GitHub笔记", link: "/fe/github" },
    { text: "This指向", link: "/fe/thisbj" },
    { text: "TypeScript笔记", link: "/fe/tsbj" },
    { text: "vue项目实战", link: "/fe/vue_project" },
    { text: "vue3基础入门", link: "/fe/vue3" },
    { text: "构建工具", link: "/fe/build_tools" },
    { text: "webpack配置示例", link: "/fe/webpack_config_samples" },
    { text: "测试笔记", link: "/fe/testbj" },
  ],
};

const beMenu = {
  text: "后端",
  items: [
    { text: "数据库基础", link: "/be/sql" },
    { text: "node实战express", link: "/be/node_express" },
    { text: "消息队列", link: "/be/message_queues" },
    { text: "日志处理", link: "/be/log" },
  ],
};

const otherMenu = {
  text: "其他",
  items: [
    { text: "新技术", link: "/other/new_technology" },
    { text: "BI项目介绍", link: "/other/bi_project_intro" },
    { text: "面试问题", link: "/other/interview_questions" },
    { text: "学习计划", link: "/other/study_plan" },
    { text: "webpack微前端实现", link: "/other/webpack_module_federation" },
  ],
};

function createNav(): DefaultTheme.NavItem[] {
  return [{ text: "首页", link: "/" }, feMenu, beMenu, otherMenu];
}

function createSideBar(): DefaultTheme.SidebarMulti {
  return {
    fe: [
      {
        collapsed: true,
        ...feMenu,
      },
    ],
    be: [
      {
        collapsed: true,
        ...beMenu,
      },
    ],
    other: [
      {
        collapsed: true,
        ...otherMenu,
      },
    ],
  };
}

export { createNav, createSideBar };
