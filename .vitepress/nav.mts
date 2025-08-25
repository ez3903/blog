import type { DefaultTheme } from 'vitepress';

export  default function createNav(): DefaultTheme.NavItem[] {
  return [
    { text: '首页',link: '/' },
    {
      text: '前端',
      items: [
        { text: 'git', link: '/fe/git' },
        { text: 'GitHub', link: '/fe/github' }
      ]
    },
    { 
      text: 'examples', 
      items: [
        { text: 'markdown-examples', link: '/examples/markdown-examples'},
        { text: 'api-examples', link: '/examples/api-examples'}
      ]
    },
  ]
}