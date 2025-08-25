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
        items: [
          { text: 'git', link: '/fe/git' },
          { text: 'gitHub', link: '/fe/github' },
        ]
      },
    ]
  }
}  
