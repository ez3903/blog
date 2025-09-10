# Express项目



## Dccker安装MySQL,Redis,RabbitMQ



## 两个全局包

| 命令                       | 说明                         |
| -------------------------- | ---------------------------- |
| npm i -g express-generator | 安装express脚手架            |
| npm i -g sequelize-cli     | 安装sequelize(orm)命令行工具 |

+ 先安装express脚手架，这样就可以用命令行创建项目
+ 接着安装sequelize-cli，这样才能执行模型、迁移、种子相关命令

| 命令                                                         | 说明                                             |
| ------------------------------------------------------------ | ------------------------------------------------ |
| express --no-view 项目名                                     | 创建项目                                         |
| npm i nodemon                                                | 安装nodemon                                      |
| npm i sequelize mysql2                                       | 安装sequelize与mysql2依赖包                      |
| sequelize init                                               | 初始化sequelize(然后修改config.json，连接数据库) |
| sequelize db:create --chartset utf8mb4 --collate utf8mb4_general_cli | 创建数据库                                       |
| sequelize model:generate --name Article --attributes title:string,content:text | 创建模型，会自动生成迁移文件(可调整)             |
| sequelize db:migrate                                         | 运行迁移文件                                     |
| sequelize seed:generate --name article                       | 创建种子文件(记得修改种子文件)                   |
| sequelize db:seed --seed 种子文件名                          | 运行指定种子文件(生成大量数据用于测试)           |
| sequelize db:seed:all                                        | 运行所有种子文件                                 |

## Express的路由配置

```js
// app.js

const articlesRouter = require('./routes/admin/articles');
app.use('/admin/articles',articlesRouter)

//articles.js

router.get('/',async function(req,res,next){
    ...
})

//使用中间件做认证等其他操作
1. 自定义中间件  middlewares/middle.js
moudle.exports = (req,res,next) => {
    ...
    next()
}
2.批量设置 -- app.js  (2和3设置一个即可生效，看是否针对某个模块整体进行认证)
const auth = require("middlewares/middle.js")
app.use('/admin/articles',auth,articlesRouter)
3.单独设置某个api -- articles.js
router.get('/',auth,async function(req,res,next){
    ...
})
```

> 通过Apifox去测试接口

## 如何获取请求中的数据

| 方法       | 说明                        | 例子                               |
| ---------- | --------------------------- | ---------------------------------- |
| req.params | 获取路由里的参数            | /admin/articles/:id                |
| req.query  | 获取URL地址里的查询参数     | /admin/articles?title=hello&page=1 |
| req.body   | 获取post，put请求发送的数据 |                                    |

## sequelize操作数据库常用方法

| 方法名          | 说明                         |
| --------------- | ---------------------------- |
| findAll         | 查询所有记录                 |
| findAndCountAll | 查询所有记录，并统计数据总数 |
| findByPk        | 通过主键查询单条数据         |
| create          | 创建新数据                   |
| update          | 更新数据                     |
| delete          | 删除数据                     |

## 登录认证

+ 使用bcryptjs加密数据
  + 生成密码之后如果对比密码不能直接对比了，因为已加密，需要用bcrptjs函数
+ 使用jwt生成token
  + 使用jsonwebtoken包
  + 使用uuid生成随机秘钥
+ tips: 使用http-erros处理状态码

## 部署

购买服务器

借助local SSH工具远程连接服务器，安装nginx

上传项目

使用PM2部署项目

上传图片到云OSS

+ 直接aliyun oss上传
+ 服务端代理上传-使用Muter 通过api上传: utils/aliyun.js   ---根据multer-aliyun-oss文档查看配置
+ 客户端直传,通过服务器获取阿里云授权，然后上传

自动备份数据库到阿里云OSS

## sequelize ORM

软删除（不真正从数据库删除，而是通过添加一个字段deletedAt，查询的时候过滤掉）

```js 
// models/article.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "标题必须存在",
          },
          notEmpty: {
            msg: "标题不能为空",
          },
          len: {
            args: [2, 30],
            msg: "标题长度必须在2-30之间",
          },
        },
      },
      content: DataTypes.TEXT,
      deletedAT: DataTypes.Date  // 添加字段做筛选，sequelize自动处理
    },
    {
      sequelize,
      paranoid: true,    // !!这里添加这个字段并设置true
      modelName: "Article",
    }
  );
  return Article;
};

// 如果要查询软删除的数据  articles.js
router.get('/',async function(req,res,next){
    ...
    const condition = {
        where: {},
   		limit: 10,
        ...
    }
    if(req.query.deleted === 'true'){
        condition.paranoid = false
        condition.where.deletedAt = {
            [Op.not]:null
        }
    }
})

// 如果要彻底删除，则需要重新写删除api
router.post('/delete',async function(req,res,next){
    ...
    const {id} = req.body
	await Article.destory({where:{id}})  // id可以是单条数据，也可以是数组
    ...
})

// 从回收站恢复
router.post('/restore',async function(req,res,next){
    ...
    const {id} = req.body
	await Article.destory({where:{id}})  // id可以是单条数据，也可以是数组
    ...
})
```

## Redis缓存

从内存读取，读取很快

Redis客户端：Redis Insight

项目中：npm i redis

```js
// 基本使用

import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();
//基础数据
await client.set('key', 'value');
const value = await client.get('key');
//复杂数据
await client.hSet('user-session:123', {
    name: 'John',
    surname: 'Smith',
    company: 'Redis',
    age: 29
})

let userSession = await client.hGetAll('user-session:123');
console.log(JSON.stringify(userSession, null, 2));

// 有数据更新需要清除缓存，下次读取存入

// api中读取
1.先从缓存读，如果有直接取
2.如果缓存没有，读取数据库，并把值存入缓存
```

## 消息队列

在企业项目里，经常会在一些不需要等待成功的地方使用消息队列，例如发送邮件、发送短信、应用类通知、文件处理、数据分析与报告生成、订单处理、秒杀。

见消息队列

## 日志

见日志处理

## 会员管理

比如数据库中有一张课程表，课程表中添加一个字段区分是否free，如果free可以免费浏览，如果不是则只能会员浏览。当然数据库中如果有章节表，也可以针对不同章节设置free.

然后添加查看、添加、删除、更改会员信息  的表

用户表中有相关角色的信息，记录是否是会员以及会员有效期

对于有关课程和章节的api添加check是否是vip的逻辑 

## 订单管理

## 支付宝支付

## 定时设置

## 实时应用

轮询、WebSocket、SSE(Server-Sent Events)

## 搜索引擎

+ elasticsearch
+ meilisearch

## 多进程运行nodejs

cluster

负载测试工具wrk(windows不支持)

## PostgreSQL

## Prisma

prisma Studio
