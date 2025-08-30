import type { DefaultTheme } from "vitepress";

const feMenu = {
  text: "前端",
  items: [
    { text: "前端进阶2025", link: "/fe/studyPlan" },
    { text: "Git笔记", link: "/fe/git" },
    { text: "GitHub笔记", link: "/fe/github" },
    { text: "TypeScript笔记", link: "/fe/tsbj" },
  ],
};

const examplesMenu = {
  text: "examples",
  items: [
    { text: "markdown-examples", link: "/examples/markdown-examples" },
    { text: "api-examples", link: "/examples/api-examples" },
  ],
};

function createNav(): DefaultTheme.NavItem[] {
  return [{ text: "首页", link: "/" }, examplesMenu, feMenu];
}

function createSideBar(): DefaultTheme.SidebarMulti {
  return {
    examples: [examplesMenu],
    fe: [
      {
        collapsed: true,
        ...feMenu,
      },
    ],
  };
}

export { createNav, createSideBar };
