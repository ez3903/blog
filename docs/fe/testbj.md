# 前端测试

## 概览

目的

+ 提高代码质量
+ 确保系统稳定性

测试分类

+ 静态测试： 代码审查，静态分析
+ 动态测试：单元测试，集成测试，端到端测试

测试方案的选择和设计

+ 单元测试
  + 验证单一功能模块
  + 单测用例可以用来主导开发，测试驱动开发
+ 集成测试
  + 验证模块交互逻辑
  + 单测之后实施
+ 端到端测试
  + 验证最终用户体验
  + 最后阶段，优先测试一些关键路径

测试金字塔模型

+ 底层：单测（多且快）
+ 中层：集成测试（适中）
+ 顶层：端到端测试（少但是全面）

测试方案

+ 单元测试（Unit Test）

  + 方法、组件作为测试单元

  + 测试逻辑正确性，保证最终结果符合预期

  + 工具框架：

    + Vitest
    + Jest
    + Mocha + Chai

  + 基本使用：

    + ```ts
      import { describe, it, expect } from 'vitest'
      describe('期望加法2 + 1 === 3',()=>{
          it('测试加法函数',()=>{
              const sum = (a,b) => a + b;
              expect(sum(1+2)).toBe(3)
          })
      })
      ```

+ 集成测试（Integration Test）

  + 测试多模块之间的交互（登录）

  + 涉及到数据库、API外部依赖

  + 工具框架

    + Supertest(Nest.js--api) 
    + Cypress（vue,react,vite）
    + JUnit

  + 基本使用

    + ```ts
      import request from 'supertest'
      import app from '../app'
      describe('API 集成测试',()=>{
          it('should fetch user details', async ()=>{
              const response = await request(app).get('/api/users/1');
              expect(response.status).toBe(200);
              expect(response.body).toHaveProperty('name')
          })
      })
      ```

+ 端到端测试（End-to-End Test e2e toB(2b)  toC(2c))

  + 站在用户角度，测试关键流程，下单流程（直接购买->选择地址等信息->支付方式->完成支付->查看订单->查看物流）

  + 模拟真实用户的操作

  + 工具和框架

    + Playwright
    + Cypress
    + Selenium

  + 基本使用

    + ```ts
      const {test,expect}  = require('@playwright/test')
      test('User can login', async(({page})=>{
          await page.goto('https://example.com/login')
          await page.fill('#username','testuser')
          await page.fill('#password','password')
          await page.click('button[type=submit]')
          await expect(page).toHaveURL('https://example.com/dashboard')
      })
      ```

> 拓展之-- RPA（robotic process automation）机器人流程自动化
>
> + 影刀
> + Headless Browser
> + 商家一大堆的ipad或者Phone，模拟用户所有行为（刷单、CRM)



