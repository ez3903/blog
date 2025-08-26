import { DefaultTheme } from "vitepress";

export default function createSideBar() :DefaultTheme.SidebarMulti {
  return {
    '/examples/': [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/examples/markdown-examples' },
          { text: 'Runtime API Examples', link: '/examples/api-examples' }
        ]
      }
    ],
    'fe': [
      {
        text: '前端',
        collapsed: true,
        items: [
          { text: '前端进阶2025', link: '/fe/studyPlan' },
          { text: 'git基础', link: '/fe/git' },
          { text: 'gitHub入门', link: '/fe/github' },
        ]
      },
    ]
  }
}  
