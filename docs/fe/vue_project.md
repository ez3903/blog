# 1.项目介绍

动力港能源管理平台是基于公司充电能源业务，结合互联网技术，实现网络化管理，与云平台实现数据共享和远程控制，使用更加便捷和智能化。便于公司对能源设备的集中管理和监测，优化充电结构，提高充电效率。

## 1.项目技术栈

**Vue3 + vue-router 4.x + pinia + TypeScript + Vite + element plus + axios + less + echarts + 高德地图api + TinyMCE富文本编辑器**

# 2.创建项目

```pow
npm create vite@latest my-vue-admin --template vue-ts
```

直接选择vite给我提供的现成的模板

安装依赖：

```powershell
npm install vue-router@4 pinia element-plus
```

**项目文件中关于：**

- **tsconfig.app.json:**一般用于更精细的控制编译选项，特别是与应用程序相关的选项，如 JSX 支持或模块解析策略等
- **tsconfig.json:**是最基本的配置文件，提供全局设置
- **tsconfig.node.json:**为 Node.js 环境或后台代码提供的 TypeScript 配置文件。通常用于配置 Node.js 脚本或服务（如 API 服务）的 TypeScript 编译选项

- **vite-env.d.ts**:全局类型声明

安装less

```powershell
npm install -D less
```

## 常见报错解决：

如果更改了@符号，提示找不到模块 ‘@/components/xxx.vue’ 或其相应的类型声明”

![image-20240828140028681](http://114.67.74.14/static/vue_project_assetsimage-20240828140028681.png)

# 3.创建文件夹结构

1. src目录下创建store用来存放pinia相关文件
2. src目录下创建router文件夹用来存放路由相关文件
3. src目录下创建views文件夹，用来存放我们的相关页面
4. src目录下创建utils文件夹，用来存放我们封装的一些工具函数



# 4.基本路由结构的创建

==src-router-index.ts==

```ts
import { createRouter, createWebHistory,RouteRecordRaw  } from 'vue-router';
const routes: RouteRecordRaw[]=[
    {
        path:'/',
        name:"Home",
        component:()=\>import("../views/Home.vue")
    },
    {
        path:'/about',
        name:"about",
        component:()=\>import("../views/About.vue")
    }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
```

==main.ts==

```ts
import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import router from './router'
const app = createApp(App);
app.use(router)//app.use(router) 是将 Vue Router 插件添加到 Vue 应用中。这意味着你的应用将能够使用路由功能
app.mount('#app')

```

==App.vue==

```vue
\<template\>
	\<RouterView/\>
\</template\>

```

# 5.配置@ src路径

因为相对路径每次找很麻烦，我们可以使用@，表示src目录

只需要在

==vite.config.ts==

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

此时可能会有报错，如下

![image-20241014143019905](http://114.67.74.14/static/vue_project_assetsimage-20241014143019905.png)

只需要运行：

在你的项目中安装 Node.js 的 TypeScript 类型定义

```powershell
npm install @types/node --save-dev
```

另外直接修改的话会看到有报错：

![image-20241014142310973](http://114.67.74.14/static/vue_project_assetsimage-20241014142310973.png)

只需要去tsconfig.app.json文件增加一个配置：即可,如下



![image-20241014142908128](http://114.67.74.14/static/vue_project_assetsimage-20241014142908128.png)

# 6.项目基础路由搭建

将基础路由单独抽离为一个文件

==src-router-basicRouteMap.ts==

```ts
import { RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] =[
    {
        path:"/",
        name:"Home",
        component:()=\>import("@/layouts/DefaultLayout.vue")
    },
    {
        path: '/login',
        name: 'Login',
        component: () =\> import("@/views/Login.vue")
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () =\> import("@/views/NotFound.vue")
    },
]

export default routes
```

==src-router-index.ts==

```ts
import { createRouter, createWebHistory} from 'vue-router';
import routes from "./basicRouteMap.ts"
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

# 7.登录页面搭建

## 1.静态基础结构搭建

参照element-plus官网案例

## 2.基础逻辑处理

```vue
\<el-form :model="ruleForm" label="用户名" :rules="rules"  ref="formRef"\>
     \<el-form-item prop="username"\>
         \<el-input v-model="ruleForm.username" placeholder="请输入用户名" prefix-icon="User"/\>
     \</el-form-item\>
     \<el-form-item prop="password"\>
         \<el-input v-model="ruleForm.password" placeholder="请输入密码" prefix-icon="Lock"/\>
     \</el-form-item\>
     \<el-form-item\>
         \<el-button type="primary" style="width: 100%;" \>登录\</el-button\>
     \</el-form-item\>
 \</el-form\>
```

```vue
\<script lang="ts" setup\>
import { reactive } from "vue";
import type { FormRules } from 'element-plus'
import logo from "@/assets/logo.png"
interface RuleForm {
  username: string;
  password: string
}
const ruleForm: RuleForm = reactive({ //reactive官网有明确说明，不推荐使用泛型的写法
  username: "",
  password: ""
})
const formRef = ref\<FormInstance\>();
const rules = reactive\<FormRules\<RuleForm\>\>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 8, message: '用户名要求3到8位字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})
\</script\>
```

**登录按钮事件**:

```ts
function handleLogin() {
  formRef.value?.validate(async (valid: boolean) =\> { //?.可选链操作符 
   console.log(valid)
  })
}
```

关于可选链操作符：

\> 可选链操作符 (`?.`) 是 JavaScript 中提供的一种简洁安全的访问嵌套属性的方法。使用可选链操作符的目的是避免在访问链中任意为 `null` 或 `undefined` 的情况引发运行时错误。

```js
someObject?.someProperty
```

\> 这段代码会安全地尝试访问 `someObject` 的 `someProperty` 属性。如果 `someObject` 是 `null` 或 `undefined`，则整个表达式会返回 `undefined`，而不会抛出异常。

**关于rules校验规则**

1. **required**: 是否必填，值为 `true` 或 `false`。
2. **message**: 验证失败时的提示信息。
3. **trigger**: 设置触发验证的时机，可以是 `blur`、`change` 等。
4. **min** 和 **max**: 适用于字符串和数组，设置最小值和最大值。
5. **type**: 数据类型，比如 `string`、`number`、`boolean`、`array`、`date` 等。
6. **pattern**: 正则表达式，用于验证输入。

## 3.登录的接口处理

登录返回的用户数据是存储在store中，所以我们去store中定义

==src-store-auth.ts==

```ts
import { defineStore } from 'pinia';
export const useUserStore=defineStore("user",{
    state:()=\>({
        token:null,
        roles:[],
        username:""
    }),
    actions:{
        
    }

})
```

既然用到了pinia，别忘了去main.ts中将pinia加入到我们的项目中

==main.ts==

```ts
// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import "./mock/index";
import "./router/guard"
import "./style.css"
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(ElementPlus);
app.mount('#app');
```



因为点击登陆之后，修改store中的数据，所以我们把登录的逻辑在action中写，现在我们需要后端接口，所以我们安装一下mockjs

```pow
npm install mockjs -D
```



src目录下新建mock文件夹，里面写index.ts

==src-mock-index.ts==

```ts
import Mock from 'mockjs';
Mock.setup({
  timeout: '200-600' // 设置延迟时间
});
//管理员权限菜单
const menulist = [
    {
      name: "数据看板",
      url: "/dashboard",
      icon: "DataLine"
    },
    {
      name: "充电站管理",
      url: "/chargingstation",
      icon: "Lightning",
      children: [
        {
          name: "充电站监控",
          url: "/chargingstation/monitor",
          icon: "VideoCamera"
        },
        {
          name: "营收统计",
          url: "/chargingstation/revenue",
          icon: "DataAnalysis"
        },
        {
          name: "充电桩管理",
          url: "/chargingstation/fault",
          icon: "Warning"
        }
      ]
    },
    {
      name: "电子地图",
      url: "/map",
      icon: "MapLocation"
    },
    {
      name: "运营管理",
      url: "/operations",
      icon: "Files",
      children: [
        {
          name: "订单管理",
          url: "/operations/orders",
          icon: "DocumentCopy",
        },
        {
          name: "订单详情",
          url: "/operations/detail",
          icon: "Share"
        },
        {
          name: "计费管理",
          url: "/operations/total",
          icon: "Money"
        },
      ]
    },
    {
      name: "报警管理",
      url: "/alarm",
      icon: "Phone"
    },
    {
      name: "会员卡管理",
      url: "/equipment",
      icon: "Magnet"
    },
    {
      name: "招商管理",
      url: "/document",
      icon: "Document"
    },
    {
      name: "系统设置",
      url: "/system",
      icon: "Setting"
    },
  
    {
      name: "个人中心",
      url: "/personal",
      icon: "User"
    },
]
//运营专员权限菜单
const menulist2 = [
    {
      name: "数据看板",
      url: "/dashboard",
      icon: "DataLine"
    },
    {
      name: "充电站管理",
      url: "/chargingstation",
      icon: "Lightning",
      children: [
        {
          name: "充电站监控",
          url: "/chargingstation/monitor",
          icon: "VideoCamera"
        },
        {
          name: "营收统计",
          url: "/chargingstation/revenue",
          icon: "DataAnalysis"
        },
        {
          name: "充电桩管理",
          url: "/chargingstation/fault",
          icon: "Warning"
        }
      ]
    },
    {
      name: "电子地图",
      url: "/map",
      icon: "MapLocation"
    },
    {
      name: "运营管理",
      url: "/operations",
      icon: "Files",
      children: [
        {
          name: "订单管理",
          url: "/operations/orders",
          icon: "DocumentCopy",
        },
        {
          name: "订单详情",
          url: "/operations/detail",
          icon: "Share"
        },
        {
          name: "计费管理",
          url: "/operations/total",
          icon: "Money"
        },
      ]
    },
    {
      name: "报警管理",
      url: "/alarm",
      icon: "Phone"
    },
    {
      name: "会员卡管理",
      url: "/equipment",
      icon: "Magnet"
    },  
    {
      name: "个人中心",
      url: "/personal",
      icon: "User"
    },
]
//登录接口
Mock.mock('https://www.demo.com/login', 'post', (options: any) =\> {
  const { username, password } = JSON.parse(options.body);
  if (username === 'admin' && password === 'admin666') {
    return {
      code: 200,
      message: '登陆成功',
      data: {
        token: 'admintokenkkljbuo2w9xla2',
        user: {
          username: '赖军',
          roles: ['admin']
        },
        menulist: menulist
      }
    };
  } else if (username === 'user' && password === 'user666') {
    return {
      code: 200,
      message: '登陆成功',
      data: {
        token: 'usertokenlkg55dws5ch4ew97cl',
        user: {
          username: '江霞',
          roles: ['user']
        },
        menulist: menulist2
      }
    };
  } else {
    return {
      code: 401,
      message: '用户名或者密码有误'
    };
  }
});
```

这里可能会有个报错

![image-20241016154349994](http://114.67.74.14/static/vue_project_assetsimage-20241016154349994.png)

我们要去全局类型声明文件配置一下

==src-vite-env.d.ts==

```ts
/// \<reference types="vite/client" /\>
declare module "mockjs"  
```

作用是：告诉编译器存在一个名为 `mockjs` 的模块

另外别忘了去main.ts文件下引入mock文件

```ts
import "./mock/index";
```



\> 创建api文件夹用来存放项目的所有api接口调用文件

## 4.axios二次封装

发送请求我们需要使用axios，所以我们去安装

```powershell
npm install axios
```

==utils-axios.ts==

```ts
import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ElNotification } from 'element-plus';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: "https://www.demo.com",//后期我们会把它替换成环境变量
    timeout: 5000 // 请求超时时间
});
// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =\> { 
        // 可以在这里添加认证 token
        // config.headers['Authorization'] = 'Bearer ' + getToken();
        return config;
    },
    (error: AxiosError) =\> {
        // 请求错误处理
        ElNotification({
            title: 'Error',
            message: 'Request Error: ' + error.message,
            type: 'error',
        });
        return Promise.reject(error);
    }
);
// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) =\> {
        const res = response.data;
        if (res.code !== 200) {
            // 根据实际业务修改状态码不是 200 时的逻辑
            ElNotification({
                title: 'Error',
                message: res.message || 'Error',
                type: 'error',
            });
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res;
        }
    },
    (error: AxiosError) =\> {
        ElNotification({
            title: 'Error',
            message: 'Response Error: ' + error.message,
            type: 'error',
        });
        return Promise.reject(error);
    }
);

export default service;
```

## 5.封装get post请求

==utils-http.ts==

```ts
import service from "./axios";
interface ResponseData{
    code: number;
    data: any;
    message: string;
  }
// 封装GET方法
function get(url: string, params?: any): Promise\<ResponseData\> {
    return service.get(url,{params} );
  }
  
  // 封装POST方法
  function post(url: string, data?: any): Promise\<ResponseData\> {
    return service.post(url, data);
  }
  
  export { get, post };
```



## 6.创建登录请求

==src-api-user.ts==

```ts
import { post } from "../utils/http"
enum Api {
    Login = '/login',
  }

interface LoginParams {
    username: string;
    password: string
}

function loginApi(data:LoginParams):Promise\<any\>{
    return post(Api.Login,data)
}  
  
export {loginApi}
```



==store-auth.ts==

```ts

import { defineStore } from 'pinia';
import { loginApi } from '../api/user';
interface LoginParams {
    username: string;
    password: string
}
export const useUserStore=defineStore("user",{
    state:()=\>({
        token:null,
        roles:[],
        username:""
    }),
    actions:{
        async login(data:LoginParams) {
            const res= await loginApi(data);
            console.log(res)
          },
    }

})
```

最后调整store里的逻辑

==store-auth.ts==

```ts

import { defineStore } from 'pinia';
import { loginApi } from '../api/user';
interface LoginParams {
    username: string;
    password: string
}
export const useUserStore=defineStore("user",{
    state:()=\>({
        token:sessionStorage.getItem('token') || null,
        roles: sessionStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')!) : [],
        username:sessionStorage.getItem("username") || "",
        menu:sessionStorage.getItem("menu")?JSON.parse(localStorage.getItem("menu")!):[]
    }),
    actions:{
        async login(data: LoginParams) {
            try {
                const {data:{token,user:{username,roles},menulist}} = await loginApi(data);
                this.token=token;
                this.roles=roles;
                this.menu=menulist;
                // //既存到pinia中又存到本地存储中是因为第一pinia中数据是响应式第二存取速度要比本地存储快
                sessionStorage.setItem("token",token);
                sessionStorage.setItem("roles",JSON.stringify(roles))
                sessionStorage.setItem("username",username)
                sessionStorage.setItem("menu",JSON.stringify(roles))
            } catch (error) {
                console.log("登录失败:", error);
                // 这里可以处理错误，比如显示提示信息
            }
        },
    }

})
```

==Login.vue==

```ts
const userStore = useUserStore();
function handleLogin() {
  formRef.value?.validate(async (valid: boolean) =\> { //?.可选链操作符 
    if(valid){
      userStore.login(ruleForm)
    }
  })

}
```

# 8.useRouter使用误区

==Login.vue==

```ts
import { useRouter } from "vue-router";
const router = useRouter()
function handleLogin() {
  formRef.value?.validate( (valid: boolean) =\> { //?.可选链操作符 
    if(valid){
      userStore.login(ruleForm);
      router.push("/")
    }
  })
}
```

但是这样有个问题，如果用户用户名密码不正确，也可以跳转，所以有同学想，那你在pinia中写跳转不就行了吗,类似如下写法

![image-20241017105930061](http://114.67.74.14/static/vue_project_assetsimage-20241017105930061.png)

但这是错误的， useRouter() 必须在组件上下文中使用。Pinia store 并不属于 Vue 组件的上下文，因此在 store 中调用 useRouter() 将导致错误



那如果我就是想在这里使用怎么办，有办法，可以将router传过来，如下更改

![image-20241017110315151](http://114.67.74.14/static/vue_project_assetsimage-20241017110315151.png)

==Login.vue==

![image-20241017110354595](http://114.67.74.14/static/vue_project_assetsimage-20241017110354595.png)

这种方式可以，不过我们还有另一种方式，就是导航守卫，导航守卫也可以控制路由跳转呀

# 9.导航守卫

==router-guard.ts==

```ts
import router from "./index";
import { useUserStore } from "../store/auth";
router.beforeEach((to, from) =\> {
    const userStore = useUserStore();
    const isLogin = userStore.token;
    // 用户未登录的情况
    if (!isLogin) {
        if (to.path !== "/login") {
            return { path: "/login" };
        }
    } else {
        // 用户已登录但尝试访问登录页面的情况
        if (to.path === "/login") {
            return { path: "/" }; // 阻止导航,让他跳回首页  
        }
    }
});
```

别忘了在main.ts中引入导航守卫文件

==main.ts==

```ts
import "@/router/guard"
```

# 10.主页面开发

==src-layouts-DefaultLayout.vue==

直接复制element plus中的布局容器

```vue
 \<el-container\>
      \<el-aside width="200px"\>Aside\</el-aside\>
      \<el-container\>
        \<el-header\>Header\</el-header\>
        \<el-main\>Main\</el-main\>
      \</el-container\>
    \</el-container\>
```

加点样式:

```vue
\<style lang="less" scoped\>
  .el-aside{
    height: 100vh;;
    box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
    background-color: white
  }
  .el-header{
    padding: 0 !important
  }
  .el-main{
    height: 80vh;
    overflow: auto;
  }
\</style\>
```

# 11.开发侧边栏组件

==components-navMenu-Menu.vue==

直接去element plus官网中复制的现成代码，删掉了group,其他不变

```vue
\<template\>
    \<el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2"
        text-color="#fff"\>
        \<el-sub-menu index="1"\>
            \<template #title\>
                \<el-icon\>
                    \<location /\>
                \</el-icon\>
                \<span\>Navigator One\</span\>
            \</template\>
            \<el-menu-item index="1-1"\>item one\</el-menu-item\>
            \<el-menu-item index="1-2"\>item two\</el-menu-item\>
            \<el-menu-item index="1-3"\>item three\</el-menu-item\>

            \<el-sub-menu index="1-4"\>
                \<template #title\>item four\</template\>
                \<el-menu-item index="1-4-1"\>item one\</el-menu-item\>
            \</el-sub-menu\>
        \</el-sub-menu\>
        \<el-menu-item index="2"\>
            \<el-icon\>\<document /\>\</el-icon\>
            \<span\>Navigator Two\</span\>
        \</el-menu-item\>
        \<el-menu-item index="3" disabled\>
            \<el-icon\>
                \<document /\>
            \</el-icon\>
            \<span\>Navigator Three\</span\>
        \</el-menu-item\>
        \<el-menu-item index="4"\>
            \<el-icon\>
                \<setting /\>
            \</el-icon\>
            \<span\>Navigator Four\</span\>
        \</el-menu-item\>
    \</el-menu\>
\</template\>
\<script\>
\</script\>
```

然后去主页面引入菜单组件即可

==DefaultLayout.vue==

```vue
\<el-aside width="200px"\>
      \<Menu\>\</Menu\>
 \</el-aside\>
\<script lang="ts" setup\>
import Menu from '../components/NavMenu/Menu.vue';
\</script\>
```

如果报错,因为TypeScript 并不知道如何理解 `.vue` 文件，因此需要这样一个声明

![image-20241017145850520](http://114.67.74.14/static/vue_project_assetsimage-20241017145850520.png)

去全局类型声明文件中设置一下即可

```ts
/// \<reference types="vite/client" /\>
declare module "mockjs"
declare module '*.vue' {
    import { ComponentOptions } from 'vue'
    const componentOptions: ComponentOptions
    export default componentOptions
  }
```

1. **模块声明**：`declare module '*.vue'` 表示所有以 `.vue` 结尾的文件都可以作为模块导入。
2. **类型定义**：它引入了 Vue 的 `ComponentOptions` 类型，这样 TypeScript 就能知道 `.vue` 文件中定义的组件是怎样的。
3. **导出**：`export default componentOptions` 允许你在导入 `.vue` 文件时，获得一个符合 `ComponentOptions` 类型的默认导出。



从store中取出菜单数据

==components-navMenu-Menu.vue==

```vue
\<script setup lang="ts"\>
import { useUserStore } from '@/store/auth';
const userStore = useUserStore();
console.log(userStore.menu)
\</script\>
```



\> **对菜单数据进行递归操作**

==components-navMenu-MenuItem.vue==

```vue
\<template\>
    \<el-sub-menu v-if="item.children" :index="item.url"\>
        \<template #title\>
            \<el-icon\>
                \<document /\>
            \</el-icon\>
            \<span\>{{ item.name }}\</span\>
        \</template\>
        \<my-menu v-for="child in item.children" :key="child.url" :item="child"\>\</my-menu\>
    \</el-sub-menu\>
    \<el-menu-item v-else :index="item.url"\>
        \<el-icon\>
            \<document /\>
        \</el-icon\>
        \<span\>{{ item.name }}\</span\>
    \</el-menu-item\>
\</template\>

\<script lang="ts"\>
import { defineComponent, PropType } from 'vue';
import  { MenuItem as MenuItemType } from "../../types/user/index"; //这里换成@符号会有bug，先不换了
export default defineComponent({
    name: 'MyMenu', // 你可以给组件起一个名字
    props: {
        item: {
            type: Object as PropType\<MenuItemType\>, //使用 TypeScript 的 PropType 来指定 item 的具体类型为 MenuItemType
            required: true
        }
    }
});
\</script\>
```

然后Menu.vue组件中调用

==components-navMenu-Menu.vue==

```vue
\<template\>
    \<el-menu \>
        \<menu-item v-for="item in menuItems" :key="item.url" :item="item"\>\</menu-item\>
    \</el-menu\>
\</template\>

\<script setup lang="ts"\>
import { useUserStore } from '@/store/auth';
import MenuItem from './MenuItem.vue';
const userStore = useUserStore();
const menuItems=userStore.menu

\</script\>
```

## 2.将图标字符串转为图标组件

因为element plus中 \<el-icon\>中放的是图标组件，虽然我们全局注册了，但是因为后端返回给我们的是字符串，没办法直接用，

所以使用component组件解决

```vue
\<component :is="item.icon" /\>
```

## 3.优化侧边栏样式

```vue
\<template\>
    \<div class="logo"\>
        \<img :src="logo" width="34px" height="34px" /\>
        \<h1\>动力港\</h1\>
    \</div\>
    \<el-menu\>
        \<menu-item v-for="item in menuItems" :key="item.url" :item="item"\>\</menu-item\>
    \</el-menu\>
\</template\>
\<script setup lang="ts"\>
import { useUserStore } from '@/store/auth';
import logo from "@/assets/logo.png"
import MenuItem from './MenuItem.vue';
const userStore = useUserStore();
const menuItems = userStore.menu

\</script\>
\<style scoped lang="less"\>
  .logo{
    display: flex;justify-content: center;height: 50px;align-items: center;padding:10px 0; 
    img{margin-left: -10px;}
    h1{color:#333;margin-left: 10px;font-size: 22px }
      
  }
  .el-menu{
    border-right: none; 
  }
\</style\>
```

修改高亮样式

==MenuItem.vue==

```vue
\<style scoped lang="less"\>
.is-active{background-color: rgb(34 , 136, 255);color: #fff !important;}
.is-active\>div span{color: #fff }
.el-menu-item:hover{
    background-color: rgb(34 , 136, 255) !important;color: #fff !important;
}
\</style\>
```

隐藏滚动条

==style.less==

```css
::-webkit-scrollbar {
    display: none;
  }
```

## 4.开启路由模式

![image-20241018103847516](http://114.67.74.14/static/vue_project_assetsimage-20241018103847516.png)

# 12.创建路由页面

数据看板：() =\> import("@/views/dashboard/DashBoard.vue")

充电站监控：() =\> import("@/views/chargingstation/Monitor.vue")

营收统计：() =\> import("@/views/chargingstation/Revenue.vue")

充电桩管理：() =\> import("@/views/chargingstation/Fault.vue")

电子地图：() =\> import("@/views/Map/ElectronicMap.vue")

订单管理：() =\> import("@/views/operations/Orders.vue")

订单详情：() =\> import("@/views/operations/Detail.vue")

计费管理：() =\> import("@/views/operations/Total.vue")

报警管理：() =\> import("@/views/alarm/Alarm.vue")

会员卡管理：() =\> import("@/views/equipment/Equipment.vue")

招商管理：() =\> import("@/views/document/Document.vue")

系统设置： () =\> import("@/views/system/System.vue")

个人中心：() =\> import("@/views/personal/Personal.vue")



然后添加二级路由的\<RouterView\>

==layouts-DefaultLayout.vue==

```vue
\<template\>
    \<el-container\>
        \<el-aside width="200px"\>
            \<Menu\>\</Menu\>
        \</el-aside\>
        \<el-container\>
            \<el-header\>Header\</el-header\>
            \<el-main\>
              \<RouterView/\>
            \</el-main\>
        \</el-container\>
    \</el-container\>
\</template\>
```

隐藏订单详情菜单

==components-navMenu-MenuItem.vue==

![image-20241018120914156](http://114.67.74.14/static/vue_project_assetsimage-20241018120914156.png)

# 13.页面权限控制

现在虽然我们的菜单是根据后端动态生成的，但是如果用户直到路由，直接手动输入路由地址，还是可以跳转，所以我们需要控制



\> 页面级权限控制常见的两种思路：

1.前端不默认创建完整路由表，后端返回权限名称，前端静态路由表中每一项都设置该路由表所需的权限，然后循环路由表，筛选出来该权限名称所拥有的路由表，通过addRoute方法动态添加路由，生成实际路由表

2.前端默认创建完整路由表，后端返回权限名称，路由表每一项中设置访问该路由所应该具备的权限，跳转的时候通过导航守卫控制是否允许跳转



==router-basicRouterMap.ts==

```ts
 {
     path: "/system",
     name: "system",
     component: () =\> import("@/views/system/System.vue"),   
     meta: {
         needAuth: ["admin", "manager"]
     }           
 },
 {
     path: "/system",
     name: "system",
     component: () =\> import("@/views/system/System.vue"),   
     meta: {
         needAuth: ["admin", "manager"]
     }           
 },
```

导航守卫添加代码

==router-guard.ts==

![image-20241018141623970](http://114.67.74.14/static/vue_project_assetsimage-20241018141623970.png)

# 14.Header组件开发

==components-TopHeader-TopHeader.vue==

```vue
\<template\>
    \<div class="header"\>
        \<div class="personal"\>
            \<el-badge is-dot class="item"\>
                \<el-icon size="20"\>
                    \<Bell /\>
                \</el-icon\>
            \</el-badge\>
            \<el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" /\>
            \<el-dropdown :hide-on-click="false" @command="handleCommand"\>
                \<span class="el-dropdown-link"\>
                    欢迎你，{{ username }}
                    \<el-icon class="el-icon--right"\>\<arrow-down /\>\</el-icon\>
                \</span\>
                \<template #dropdown\>
                    \<el-dropdown-menu\>
                        \<el-dropdown-item icon="User" command="user"\>个人中心\</el-dropdown-item\>
                        \<el-dropdown-item icon="SwitchButton" command="logout"\>退出登录\</el-dropdown-item\>
                    \</el-dropdown-menu\>
                \</template\>



            \</el-dropdown\>
        \</div\>

    \</div\>
\</template\>

\<script setup lang="ts"\>
import { useUserStore } from "@/store/auth.ts"
import { storeToRefs } from "pinia";
import {useRouter} from "vue-router"
const userStore=useUserStore()
const {username}=storeToRefs(userStore) 
const router=useRouter();
function handleCommand(command:string) {
    if (command == "user") {
        router.push("/personal") 
    } else {
        userStore.logout()
        router.push("/login")
    }
}
\</script\>
\<style lang="less"\>
.header {
    background-color: white;
    height: 60px;
    align-items: center;
    padding: 0 20px;
    .personal {
        float: right;
        height: 60px;
        display: flex;
        align-items: center;

        .el-dropdown-link {
            margin-left: 20px;
        }

        .item {
            margin-top: 10px;
            margin-right: 20px;
        }
    }
}
\</style\>
```

==store-auth.ts==

actions中添加logout

```ts
 logout() {
            this.token = null;
            this.roles = [];
            this.username=""
            this.menu=[]
            sessionStorage.clear()
          },
```

# 15.快捷页签导航开发

## 1.基本功能

先在DefaultLayout页面尝试基本功能

==layouts-DefaultLayout.vue==

```vue
\<template\>
  \<el-container\>
    \<el-aside width="200px"\>
      \<Menu\>\</Menu\>
    \</el-aside\>
    \<el-container\>
      \<el-header\>
        \<TopHeader /\>
      \</el-header\>
      \<el-main\>
        \<el-tabs 
            v-model="activeName" 
            class="demo-tabs" 
            closable
            @tab-click="handleClick"
            @tab-remove="remove"
        \>
            \<el-tab-pane label="User" name="first"\>
              \<template #label\>
                \<span class="custom-tabs-label"\>
                  \<el-icon\>\<calendar /\>\</el-icon\>
                  \<span\>Route\</span\>
                \</span\>
              \</template\>
              route的内容
            \</el-tab-pane\>
            \<el-tab-pane label="Config" name="second"\>Config\</el-tab-pane\>
            \<el-tab-pane label="Role" name="third"\>Role\</el-tab-pane\>
            \<el-tab-pane label="Task" name="fourth"\>Task\</el-tab-pane\>
          \</el-tabs\>
        \<RouterView /\>
      \</el-main\>
    \</el-container\>
  \</el-container\>
\</template\>
\<script setup lang="ts"\>
import { ref } from 'vue'
import Menu from "@/components/navMenu/Menu.vue"
import TopHeader from "@/components/TopHeader/TopHeader.vue"
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick=(tab: TabsPaneContext, event: Event)=\>{
  console.log(tab, event)
  }
  const remove=(panelName:string)=\>{
    console.log(panelName)
  }
\</script\>

\<style lang="less" scoped\>
.el-aside {
  height: 100vh;
  ;
  box-shadow: 10px 0 8px -2px rgba(0, 0, 0, 0.2);
  background-color: white
}

.el-header {
  padding: 0 !important
}

.el-main {
  height: 80vh;
  overflow: auto;
}
\</style\>
```

然后创建单独的组件

==layouts-TabsLayout.vue==

将这些内容全部复制到该组件下

```vue
\<template\>
    \<el-tabs v-model="activeName" class="demo-tabs" closable @tab-click="handleClick" @tab-remove="remove"\>
        \<el-tab-pane label="User" name="first"\>
            \<template #label\>
                \<span class="custom-tabs-label"\>
                    \<el-icon\>
                        \<calendar /\>
                    \</el-icon\>
                    \<span\>Route\</span\>
                \</span\>
            \</template\>
            route的内容
        \</el-tab-pane\>
        \<el-tab-pane label="Config" name="second"\>Config\</el-tab-pane\>
        \<el-tab-pane label="Role" name="third"\>Role\</el-tab-pane\>
        \<el-tab-pane label="Task" name="fourth"\>Task\</el-tab-pane\>
    \</el-tabs\>
\</template\>
\<script setup lang="ts"\>
import { ref } from "vue"
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) =\> {
    console.log(tab, event)
}
const remove = (panelName: string) =\> {
    console.log(panelName)
}
\</script\>
```

那么问题来了，应该有几个tab-pane呢，应该是点击一次菜单，就应该多一个，默认有dashboard一个,所以此时我们创建store，存储所点击的菜单项

==store-tabs.ts==

```ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type{MenuItem} from "@/types/user"
export const useTabsStore = defineStore("tabs",()=\>{
    const tabs = ref\<MenuItem[]\>([{ name: "数据看板", path: "/dashboard", icon: "DataLine" }]);
    const addTab = (name: string, path: string, icon: string) =\> {
        if (!tabs.value.some(tab =\> tab.path === path)) {
            tabs.value.push({ name, path, icon });
        }
    }
    return {tabs,addTab}
})
```

DefaultLayout.vue文件引入TabsLayout

==DefaultLayout.vue==

```vue
\<el-main\>
    \<TabsLayout/\>
    \<!-- \<RouterView /\> --\>
\</el-main\>
```

```ts
import TabsLayout from "@/layouts/TabsLayout.vue"
```

==layouts-TabsLayout.vue==

```ts
import {useTabsStore} from "@/store/tabs.ts"
import { storeToRefs } from 'pinia';
const tabsStore = useTabsStore();
const {tabs}=storeToRefs(tabsStore);
console.log(88,tabs.value) //这里验证，确实可以拿到store中的数据
```

## 2.添加页签

==components-NavMenu-MenuItem.vue==

```vue
 \<el-menu-item v-else :index="item.url" @click="add(item.name, item.url, item.icon)" v-show="!(item.name == '订单详情')"\>
        \<el-icon\>
            \<component :is="item.icon" /\>
        \</el-icon\>
        \<span\>{{ item.name }}\</span\>
    \</el-menu-item\>

\<script lang="ts"\>
import { defineComponent, PropType } from 'vue';
import { MenuItem as MenuItemType } from "../../types/user/index";
import { useTabsStore } from '@/store/tabs';
export default defineComponent({
    name: 'MyMenu', // 你可以给组件起一个名字
    props: {
        item: {
            type: Object as PropType\<MenuItemType\>,
            required: true
        }
    },
    setup() {
        const tabsStore=useTabsStore();
        const {addTab}=tabsStore;
        function add(name: string, url: string, icon: string) {
            addTab(name, url, icon)
        }
        return {add }
    }
});
\</script\>
```

==layouts-TabsLayout.vue==

```vue
\<template\>
    \<el-tabs v-model="activeName" class="demo-tabs" type="card" closable @tab-click="handleClick" @tab-remove="remove"\>
        \<el-tab-pane 
            v-for="item in tabs"
            :key="item.name"
            :label="item.name"
            :name="item.name"
        \>
            \<template #label\>
                \<span class="custom-tabs-label"\>
                    \<el-icon\>
                        \<component :is="item.icon" /\>
                    \</el-icon\>
                    \<span\>&nbsp;{{ item.name }}\</span\>
                \</span\>
            \</template\>
            route的内容
        \</el-tab-pane\>
    \</el-tabs\>
\</template\>
\<style lang="less" scoped\>
 .demo-tabs {
  ::v-deep  .is-active{color: white !important;background-color: #5696ff;}
  }
\</style\>
```

将\<RouterView\>挪到tabs中

很多同学的想法肯定是像下面这样加

![image-20241019133130266](http://114.67.74.14/static/vue_project_assetsimage-20241019133130266.png)

但是这样你想想，会渲染几个\<RouterView\>,很明显，循环执行了几次，就会有几个RouterView

我们可以在dashboard页面验证一下

==views-dashboard-DashBoard.vue==

```vue
\<template\>
    数据看板
\</template\>
\<script setup\>
import {onMounted} from "vue"
    onMounted(()=\>{
        console.log(888) //会发现，有几个选项卡就会执行几次
    })
\</script\>
```

所以我们把RouterView拿到tabs的外面去，如下

![image-20241019133442049](http://114.67.74.14/static/vue_project_assetsimage-20241019133442049.png)

## 3.左侧菜单和页签同步的问题

store设置一个currentTab，用来保存当前高亮/选中的tab,再添加一个setCurrentTab方法，设置当前高亮的方法

==store-tabs.ts==

```ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type{MenuItem} from "@/types/user"
export const useTabsStore = defineStore("tabs",()=\>{
    const tabs = ref\<MenuItem[]\>([{ name: "数据看板", url: "/dashboard", icon: "DataLine" }]);
    const currentTab = ref\<{ name: string; url: string }\>({ name: "数据看板", url: "/dashboard" });
    const addTab = (name: string, url: string, icon: string) =\> {
        if (!tabs.value.some(tab =\> tab.url === url)) {
            tabs.value.push({ name, url, icon });
        }
    }
    const setCurrentTab = (name: string, path: string) =\> {
        currentTab.value = { name, path }
       
    }
    return {tabs,addTab,currentTab,setCurrentTab}
})
```

==layouts-TabsLayout.vue==

```vue
\<el-tabs v-model="currentTab.name" \> 更改双向绑定
    
\<script setup lang="ts"\>
import { ref } from "vue"
import type { TabsPaneContext } from 'element-plus'
import {useTabsStore} from "@/store/tabs.ts"
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
const tabsStore = useTabsStore();
const router=useRouter();
const {tabs,currentTab}=storeToRefs(tabsStore);//添加解构赋值
const {setCurrentTab}=tabsStore;//因为是方法，不需要响应式，单独解构
const handleClick = (tab: TabsPaneContext, event: Event) =\> {
    router.push(tabs.value[tab.index].url) //路由跳转
    setCurrentTab(tabs.value[tab.index].name,tabs.value[tab.index].url) //设置当前
}
const remove = (panelName: string) =\> {
    console.log(panelName)
}
\</script\>
```

==components-navMenu-MenuItem.vue==

```ts
    setup() {
        const tabsStore=useTabsStore();
        const {addTab,setCurrentTab}=tabsStore;
        function add(name: string, url: string, icon: string) {
            addTab(name, url, icon);
            setCurrentTab(name,url)
        }
        return {add }
    }
```

## 4.解决刷新的问题

之所以刷新后左侧菜单和tab对应不上，是因为我们给tab设置了一刷新默认都是dashboard，这个不太合理，所以去掉默认值如下

![image-20241019141947305](http://114.67.74.14/static/vue_project_assetsimage-20241019141947305.png)

刷新的时候我们能通过路由对象拿到当前路径，但是我需要拿到当前菜单数据的name和icon，所以我们定义一个方法，根据path，去菜单数据里找出对应的那个数据对象

==layouts-TabsLayout.vue==

```ts
import { useRouter,useRoute } from 'vue-router';
const route=useRoute()
const {menu} =storeToRefs(userStore)

function findObjectByUrl(arr, url) {
  for (const item of arr) {
    if (item.url === url) {
      return item;
    }
    if (item.children) {
      const found = findObjectByUrl(item.children, url);
      if (found) {
        return found;
      }
    }
  }
  return null; // 如果未找到，返回 null
}

const {name,url,icon}=findObjectByUrl(menu.value,route.path)

addTab(name,url,icon)
setCurrentTab(name,url)
```

## 5.删除功能

基本的删除功能

==store-tabs.ts==

```ts
    const removeTab = (name: string) =\> {
        // 删除指定路径的选项卡
        tabs.value = tabs.value.filter(tab =\> tab.name !== name)
    }
```

==layouts-TabsLayout.vue==

```ts
const remove = (panelName: string) =\> {
    removeTab(panelName);
}
```

但是如果删除的是当前高亮的tab，就会有bug



tabs.ts做如下修改

==store-tabs.ts==

```ts
    const removeTab = (name: string) =\> {
        //如果删除的是高亮的
        if (currentTab.value.name === name){
            const currentIndex = tabs.value.findIndex(tab =\> tab.name === name);
             // 如果被移除的标签是当前标签，更新当前标签为前面一个标签
             currentTab.value = tabs.value[currentIndex - 1]; 
        }

        // 删除指定路径的选项卡
        tabs.value = tabs.value.filter(tab =\> tab.name !== name)
    }
```

==layouts-TabsLayout.vue==并将路由跳转过去

```ts
const remove = (panelName: string) =\> {
    removeTab(panelName);
    router.push(currentTab.value.url)
}
```



还是会有bug,如下优化

```ts
const remove = (panelName: string) =\> {

    if(currentTab.value.name==panelName){
        //如果点击的是高亮的
        console.log(552,currentTab.value)
        removeTab(panelName);
        router.push(currentTab.value.url)
    }else{
        removeTab(panelName); 
    }
   
}
```

但是，如果多个页签，选中了第一个，再删除第一个，就会有bug,改成如果高亮 是第一个，不允许删除

==store-tabs.ts==

```ts
    const removeTab = (name: string) =\> {
        //如果删除的是高亮的
        if (currentTab.value.name === name){
            const currentIndex = tabs.value.findIndex(tab =\> tab.name === name);
             // 如果被移除的标签是当前标签，更新当前标签为前面一个标签
             if(currentIndex!=0){
                currentTab.value = tabs.value[currentIndex - 1]; 
             }else{
                return
             }   
        }

        // 删除指定路径的选项卡
        tabs.value = tabs.value.filter(tab =\> tab.name !== name)
    }
```

# 16.数据看板页面开发

## 1.设备运行状态模块开发

```vue
\<template\>
    \<el-row :gutter="20"\>
        \<el-col :span="18"\>
            \<el-card\>
                \<div class="title"\>
                    \<h3\>今日设备运行状态\</h3\>
                    \<p\>更新时间：2024年8月31日\</p\>
                    \<el-icon color="#86909c" style="margin-left: 5px;"\>
                        \<Refresh /\>
                    \</el-icon\>
                \</div\>
                \<div class="equipment"\>
                    \<div class="item"\>
                        \<h4\>充电桩使用率\</h4\>
                        \<img :src="flash" alt="" class="mb mt"\>
                        \<h1\>72 / 95\</h1\>
                        \<div class="statistic-card"\>
                            \<el-statistic :value="9"\>
                                \<template #title\>
                                    \<div style="display: inline-flex; align-items: center"\>
                                        异常设备
                                        \<el-tooltip effect="dark"
                                            content="Number of users who logged into the product in one day"
                                            placement="top"\>
                                            \<el-icon style="margin-left: 4px" :size="12"\>
                                                \<Warning /\>
                                            \</el-icon\>
                                        \</el-tooltip\>
                                    \</div\>
                                \</template\>
                            \</el-statistic\>
                            \<div class="statistic-footer"\>
                                \<div class="footer-item"\>
                                    \<span\>相较昨日\</span\>
                                    \<span class="green"\>
                                        24%
                                        \<el-icon color="green"\>
                                            \<CaretTop /\>
                                        \</el-icon\>
                                    \</span\>
                                \</div\>
                            \</div\>
                        \</div\>
                    \</div\>
                    \<div class="item"\>
                        \<h4\>充电柜使用率\</h4\>
                        \<img :src="flash2" alt="" class="mb mt"\>
                        \<h1\>655 / 1233\</h1\>
                        \<div class="statistic-card"\>
                            \<el-statistic :value="22"\>
                                \<template #title\>
                                    \<div style="display: inline-flex; align-items: center"\>
                                        异常设备
                                        \<el-tooltip effect="dark"
                                            content="Number of users who logged into the product in one day"
                                            placement="top"\>
                                            \<el-icon style="margin-left: 4px" :size="12"\>
                                                \<Warning /\>
                                            \</el-icon\>
                                        \</el-tooltip\>
                                    \</div\>
                                \</template\>
                            \</el-statistic\>
                            \<div class="statistic-footer"\>
                                \<div class="footer-item"\>
                                    \<span\>相较昨日\</span\>
                                    \<span class="green"\>
                                        24%
                                        \<el-icon color="red"\>
                                            \<CaretTop /\>
                                        \</el-icon\>
                                    \</span\>
                                \</div\>
                            \</div\>
                        \</div\>
                    \</div\>
                    \<div class="item"\>
                        \<h4\>充电站使用率\</h4\>
                        \<img :src="flash3" alt="" class="mb mt"\>

                        \<h1\>2263 / 3398\</h1\>
                        \<div class="statistic-card"\>
                            \<el-statistic :value="47"\>
                                \<template #title\>
                                    \<div style="display: inline-flex; align-items: center"\>
                                        异常设备
                                        \<el-tooltip effect="dark"
                                            content="Number of users who logged into the product in one day"
                                            placement="top"\>
                                            \<el-icon style="margin-left: 4px" :size="12"\>
                                                \<Warning /\>
                                            \</el-icon\>
                                        \</el-tooltip\>
                                    \</div\>
                                \</template\>
                            \</el-statistic\>
                            \<div class="statistic-footer"\>
                                \<div class="footer-item"\>
                                    \<span\>相较昨日\</span\>
                                    \<span class="green"\>
                                        24%
                                        \<el-icon color="green"\>
                                            \<CaretTop /\>
                                        \</el-icon\>
                                    \</span\>
                                \</div\>
                            \</div\>
                        \</div\>
                    \</div\>
                \</div\>
            \</el-card\>
        \</el-col\>
        \<el-col :span="6"\>\</el-col\>
    \</el-row\>
\</template\>
\<script setup\>
import flash from "@/assets/flash.png"
import flash2 from "@/assets/flash2.png"
import flash3 from "@/assets/flash3.png"
\</script\>
\<style lang="less" scoped\>
.title {
    display: flex;
    align-items: flex-end;
    /* 底部对齐 */
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    p {
        color: #86909c;
        margin-left: 20px;
    }

}
.equipment {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;

    .item {
        h4 {
            margin-bottom: 20px;
            margin-top: 20px;
        }

        h1 {
            font-size: 36px;
            margin-bottom: 20px;
        }

        .statistic-card {
            .el-statistic__content {
                margin: 10px !important;
            }
        }

    }
}
\</style\>
```

## 2.常用功能页面开发

```vue
            \<el-card class="mt"\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h1\>常用功能\</h1\>
                    \</div\>
                \</template\>
                \<div class="quick mt mb"\>
                    \<div :span="4"\>
                        \<img :src="repair"\>
                        \<p\>设备维修\</p\>
                    \</div\>
                    \<div :span="4"\>
                        \<img :src="daily"\>
                        \<p\>每日日报\</p\>
                    \</div\>
                    \<div :span="4"\>
                        \<img :src="progress"\>
                        \<p\>任务进度\</p\>
                    \</div\>
                    \<div :span="4"\>
                        \<img :src="total"\>
                        \<p\>营收占比\</p\>
                    \</div\>
                    \<div :span="4"\>
                        \<img :src="money"\>
                        \<p\>营收统计\</p\>
                    \</div\>
                    \<div :span="4"\>
                        \<img :src="remain"\>
                        \<p\>待办事项\</p\>
                    \</div\>
                \</div\>
            \</el-card\>
\<script\>
import flash from "@/assets/flash.png"
import flash2 from "@/assets/flash2.png"
import flash3 from "@/assets/flash3.png"
import repair from "@/assets/repair.png"
import progress from "@/assets/progress.png"
import remain from "@/assets/remain.png"
import total from "@/assets/total.png"
import money from "@/assets/money.png"
import daily from "@/assets/daily.png"
\</script\>
\<style\>
	.quick {
    padding: 0 40px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    p {
        margin-top: 10px;
        color: #333;
    }
}
\</style\>
```

## 3.使用echarts

安装echarts

```pow
npm install echarts --save
```

```ts
import * as echarts from 'echarts';
```

添加一个card

```vue
 \<el-card class="mt"\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h1\>能源统计\</h1\>
                    \</div\>
                \</template\>
                \<el-row\>
                    \<el-col :span="6"\>
                        \<div ref="chartRef2" style="width: 100%; height: 400px;margin-top: -40px"\>\</div\>
                    \</el-col\>
                    \<el-col :span="18"\>
                        \<div ref="chartRef" style="width: 100%; height: 400px;"\>\</div\>
                    \</el-col\>
                \</el-row\>
  \</el-card\>
```

如下这样写刚好报错，因为我们的图标需要用到dom实例，但是现在是在setup生命周期里的，所以需要在挂载完毕的时候渲染图表

```vue
\<script setup\>
import * as echarts from 'echarts';
import {ref} from "vue"
const chartRef = ref(null)
const chartRef2 = ref(null)
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(chartRef.value);
// 绘制图表
myChart.setOption({
  title: {
    text: 'ECharts 入门示例'
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }
  ]
});

\</script\>
```

改成下面的写法才可生效

```vue
\<script setup\> 
import * as echarts from 'echarts';
import { ref } from "vue"
import { onMounted } from "vue"
const chartRef = ref(null)
const chartRef2 = ref(null)
// 基于准备好的dom，初始化echarts实例

onMounted(() =\> {
    var myChart = echarts.init(chartRef.value);
    // 绘制图表
    myChart.setOption({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
            {
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }
        ]
    });
})
\</script\>
```

## 4.解决窗口变化echarts适配问题

添加resize事件

```ts
onMounted(()=\>{
    // 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(chartRef.value);
// 绘制图表
myChart.setOption({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
});
const resizeChart = () =\> {
    myChart.resize();
    };
window.addEventListener('resize', resizeChart);
})
```

样式穿透优化一下

```css
 .statistic-card {
           :deep(.el-statistic__content) {
                margin: 10px !important;
            }
        }
```



## 5.封装useChart自定义组合式函数

hooks-useChart.ts

```ts

import { ref, onMounted, onBeforeUnmount, Ref,markRaw  } from 'vue';
import * as echarts from 'echarts';
export function useChart(chartRef: Ref\<HTMLElement | null\>, initialOptions: any){
    const chartInstance = ref\<echarts.ECharts | null\>(null);
    const chartOptions = ref(initialOptions);
    const initChart = () =\> {
        if (chartRef.value) {
             chartInstance.value =echarts.init(chartRef.value);
             chartInstance.value.setOption(chartOptions.value);
        }
    };
    const resizeChart = () =\> {
        chartInstance.value?.resize();
    };
    onMounted(() =\> {
        initChart();
        window.addEventListener('resize', resizeChart);
    });
    onBeforeUnmount(() =\> {
        window.removeEventListener('resize', resizeChart);
        if (chartInstance.value) {
            chartInstance.value.dispose();//dispose 方法的作用是释放图表实例所占用的资源，以便在不再需要图表时清理内存
        }
    });

}
```

这样封装有问题，会发现当我改变窗口的时候会报错

按如下更改：

```ts
  // Echarts 管理的状态和数据与 Vue 的响应式产生冲突，导致Echarts 无法正常更新而报错。
            // 解决：取消 VUE 的响应式系统观测 Echarts 的变化更新，让Echarts 自动更新。
            chartInstance.value =markRaw(echarts.init(chartRef.value)) ;
```

使用：

==DashBoard.vue==

```ts
const chartRef = ref(null)
const chartOptions = {
    title: {
        text: 'ECharts 入门示例'
    },
    tooltip: {},
    xAxis: {
        data: ['衬衫333', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
        {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }
    ]
}
useChart(chartRef,chartOptions)
```

## 6.实现电量统计的图表

基本的配置:

```ts
const chartOptions = {
    title: {
        text: '电量统计',
        left: 'left top'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            return params[0].name + '\<br/\>' + params[0].seriesName + ': ' + params[0].value + 'KW';
        }
    },
    legend: {
        data: ['充电量', '充电时长', '充电功率'],
        textStyle: {
            color: '#333'
        }
    },
    xAxis: {
        type: 'category',
        data: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        name: 'KW',
        axisLabel: {
            formatter: '{value} KW'
        }
    },
    series: [
        {
            name: '充电量',
            type: 'line',
            data: [20, 50, 30, 70, 60, 80, 40, 60, 50],
            itemStyle: {
                color: 'purple',
                shadowColor: 'rgba(0, 0, 255, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        },
        {
            name: '充电时长',
            type: 'line',
            data: [40, 60, 50, 80, 70, 90, 60, 70, 80],
            itemStyle: {
                color: 'lightgreen',
                shadowColor: 'rgba(0, 255, 0, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        },
        {
            name: '充电功率',
            type: 'line',
            data: [30, 40, 60, 50, 70, 20, 30, 40, 60],
            itemStyle: {
                color: 'skyblue',
                shadowColor: 'rgba(173, 216, 230, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        }
    ]
};
```

这样数据是写死的，我们真实工作中数据肯定是通过接口获取，所以添加获取图表数据的接口

==mock-index.ts==

```ts
//echarts图表数据接口
Mock.mock("https://www.demo.com/chartData",'get',()=\>{
  return {
    code: 200,
    message: '登陆成功',
    data: {
      list:[
        {name:"充电量",data: [20, 50, 30, 70, 60, 80, 40, 60, 50]},
        {name:"充电时长",data: [40, 60, 50, 80, 70, 90, 60, 70, 80]},
        {name:"充电功率",data:  [30, 40, 60, 50, 70, 20, 30, 40, 60]}
      ]
    }
  };
})
```

==api-dashboard.ts==

```ts
import { get } from "../utils/http"
enum Api {
    chartData = '/chartData',
  }

  function chartDataApi():Promise\<any\>{
    return get(Api.chartData)
}  
  
export {chartDataApi}
```

优化我们之前封装的组合式函数

==Dashboard.vue==

```ts
import {chartDataApi} from "@/api/dashboard"
import { reactive } from "vue"
const chartRef = ref(null)
const setChartData=async ()=\>{
    const chartOptions = reactive({
    title: {
        text: '电量统计',
        left: 'left top'
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            return params[0].name + '\<br/\>' + params[0].seriesName + ': ' + params[0].value + 'KW';
        }
    },
    legend: {
       // data: ['充电量', '充电时长', '充电功率'],
        textStyle: {
            color: '#333'
        }
    },
    xAxis: {
        type: 'category',
        data: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        name: 'KW',
        axisLabel: {
            formatter: '{value} KW'
        }
    },
    series: [
        {
         
            name: '充电量',
            type: 'line',
           // data: [20, 50, 30, 70, 60, 80, 40, 60, 50],
            itemStyle: {
                color: 'purple',
                shadowColor: 'rgba(0, 0, 255, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        },
        {
            name: '充电时长',
            type: 'line',
          //  data: [30, 40, 60, 50, 70, 20, 30, 40, 60],
            itemStyle: {
                color: 'lightgreen',
                shadowColor: 'rgba(0, 255, 0, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        },
        {
            name: '充电功率',
            type: 'line',
          //   data: [30, 40, 60, 50, 70, 20, 30, 40, 60],
            itemStyle: {
                color: 'skyblue',
                shadowColor: 'rgba(173, 216, 230, 0.5)',
                shadowBlur: 10
            },
            lineStyle: {
                width: 4
            },
            smooth: true
        }
    ]
});
    const res=await chartDataApi();
    for(let i=0;i\<res.data.list.length;i++){
        chartOptions.series[i].name=res.data.list[i].name
        chartOptions.series[i].data=res.data.list[i].data
    }
    chartOptions.legend.data=res.data.list.map(item=\>item.name)  
    return chartOptions
}

useChart(chartRef,setChartData)
```

==useChart.ts==

```ts

import { ref, onMounted, onBeforeUnmount, Ref,markRaw  } from 'vue';
import * as echarts from 'echarts';
export function useChart(chartRef: Ref\<HTMLElement | null\>, setChartData: any){

    const chartInstance = ref\<echarts.ECharts | null\>(null);
    //const chartOptions = ref(initialOptions);
    const initChart =async () =\> {
        if (chartRef.value) {
             chartInstance.value =markRaw(echarts.init(chartRef.value));
             const options=await setChartData()
             chartInstance.value.setOption(options);
        }
        
    };
    const resizeChart = () =\> {
        chartInstance.value?.resize();
    };
    onMounted(() =\> {
        initChart();
        window.addEventListener('resize', resizeChart);
    });
    onBeforeUnmount(() =\> {
        window.removeEventListener('resize', resizeChart);
        if (chartInstance.value) {
            chartInstance.value.dispose();
        }
    });

}
```

封装好之后，同理饼图我们也可以如此设置

原始配置项

```ts
const options = {
    legend: {
        top: 'bottom',

    },

    tooltip: {
        trigger: 'item',
        formatter: '{a} \<br/\>{b}: {c} %'
    },
    series: [
        {
            name: '营收占比',
            type: 'pie',
            radius: ['50%', '70%'], // 内外半径形成环形
            center: ['50%', '50%'],
            roseType: 'area',
            color: ['#4B6EBD', '#3DBB92', '#53C1D6'], // 颜色
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            data: [
                { value: 35, name: '充电桩' },  // 数据值和名称
                { value: 30, name: '充电站' },
                { value: 25, name: '充电杆' }
            ]
        }
    ],
    graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
            text: '营收占比',
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fontSize: 20,
            fill: '#333'
        }
    }
}
```

==api-dashboard.ts==

```ts
import { get } from "../utils/http"
enum Api {
    chartData = '/chartData',
    chartData2 = '/chartData2',
  }

 function chartDataApi():Promise\<any\>{
    return get(Api.chartData)
}  
function chartDataApi2():Promise\<any\>{
    return get(Api.chartData2)
}  
export {chartDataApi,chartDataApi2}
```

==mock-index.ts==

```ts
////echarts图表数据接口2 饼图
Mock.mock("https://www.demo.com/chartData2",'get',()=\>{
  return {
    code: 200,
    message: '操作成功',
    data: {
      list:[
        { value: 35, name: '充电桩' },  // 数据值和名称
        { value: 30, name: '充电站' },
        { value: 25, name: '充电杆' }
      ]
    }
  };
})
```

Dashboard.vue

```ts
const setChartData2=async ()=\>{
    const chartOptions=reactive({
    legend: {
        top: 'bottom',

    },

    tooltip: {
        trigger: 'item',
        formatter: '{a} \<br/\>{b}: {c} %'
    },
    series: [
        {
            name: '营收占比',
            type: 'pie',
            radius: ['50%', '70%'], // 内外半径形成环形
            center: ['50%', '50%'],
            roseType: 'area',
            color: ['#4B6EBD', '#3DBB92', '#53C1D6'], // 颜色
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '16',
                    fontWeight: 'bold'
                }
            },
            data: []
        }
    ],
    graphic: {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
            text: '营收占比',
            textAlign: 'center',
            textVerticalAlign: 'middle',
            fontSize: 20,
            fill: '#333'
        }
    }
});
    const res=await chartDataApi2();
    chartOptions.series[0].data=res.data.list
    return chartOptions
}

useChart(chartRef,setChartData)
useChart(chartRef2,setChartData2)

```

## 7.雷达图

```vue
  \<el-card\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h1\>设备总览\</h1\>
                    \</div\>
                \</template\>
                \<div ref="chartRef3" style="width: 100%; height: 240px;"\>\</div\>
            \</el-card\>
```



==mock==

```ts
//echarts图表数据接口3 雷达图
Mock.mock("https://www.demo.com/chartData3",'get',()=\>{
  return {
    code: 200,
    message: '操作成功',
    data: {
      list: [42, 30, 200, 350, 500, 180]
    }
  };
})
```

api

```ts
function chartDataApi3():Promise\<any\>{
    return get(Api.chartData3)
}  
```

```ts
const setChartData3 = async () =\> {
    const chartOptions = reactive({
    radar: {
        // shape: 'circle',
        indicator: [
            { name: '闲置数', max: 65 },
            { name: '使用数', max: 160 },
            { name: '故障数', max: 300 },
            { name: '维修数', max: 380 },
            { name: '更换数', max: 520 },
            { name: '报废数', max: 250 }
        ]
    },
    series: [
        {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
                {
                    value: [],
                    name: 'Allocated Budget'
                },

            ]
        }
    ]
});
    const res = await chartDataApi3();
    chartOptions.series[0].data[0].value = res.data.list
    return chartOptions
}
```

## 8.营收统计表开发

```vue
 \<el-card class="mt"\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h1\>营收统计表\</h1\>
                    \</div\>
                \</template\>
                \<ul class="ranking-list"\>
                    \<li class="ranking-item"\>
                        \<span class="rank" style="background-color:rgb(103, 194, 58);color: #fff ;"\>1\</span\>
                        \<span class="store-name"\>广州\</span\>

                        \<span class="sales"\>52,457\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="green"\>
                                \<CaretTop /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank" style="background-color:rgb(64, 158, 255) ;color: #fff ;"\>2\</span\>
                        \<span class="store-name"\>上海\</span\>
                        \<span class="sales"\>323,234\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="red"\>
                                \<CaretBottom /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank" style="background-color:rgb(230, 162, 60) ;color: #fff ;"\>3\</span\>
                        \<span class="store-name"\>佛山\</span\>
                        \<span class="sales"\>192,255\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="red"\>
                                \<CaretBottom /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank"\>4\</span\>
                        \<span class="store-name"\>珠海\</span\>
                        \<span class="sales"\>17,540\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="green"\>
                                \<CaretTop /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank"\>5\</span\>
                        \<span class="store-name"\>深圳\</span\>
                        \<span class="sales"\>662,337\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="red"\>
                                \<CaretBottom /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank"\>6\</span\>
                        \<span class="store-name"\>厦门\</span\>
                        \<span class="sales"\>22,941\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="green"\>
                                \<CaretTop /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                    \<li class="ranking-item"\>
                        \<span class="rank"\>7\</span\>
                        \<span class="store-name"\>长沙\</span\>
                        \<span class="sales"\>565,221\</span\>
                        \<span style="margin-left: 50px;"\>
                            24%
                            \<el-icon color="green"\>
                                \<CaretTop /\>
                            \</el-icon\>
                        \</span\>
                    \</li\>
                \</ul\>
            \</el-card\>
```

```css
.ranking-list {
    list-style-type: none;
    padding: 0;
}

.ranking-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-radius: 5px;
}

.ranking-item:nth-child(even) {
    background-color: rgb(253, 246, 236);
    /* 交替背景色 */
}


.rank {
    font-weight: bold;
    color: #666;
    display: inline-block;
    width: 30px;
    height: 30px;

    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    /* 排名颜色 */
}

.store-name {
    flex-grow: 1;
    padding: 0 10px;
}

.sales {
    color: #666;
    /* 销售额颜色 */
}
```

## 9.故障报警

```vue
\<el-card class="mt"\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h1\>故障报警\</h1\>
                    \</div\>
                \</template\>
                \<el-timeline style="max-width: 600px"\>
                    \<el-timeline-item timestamp="2018/4/12" placement="top" :hollow="true" type="danger"\>
                        \<el-card\>
                            \<h4\>矿业北路通讯中断\</h4\>
                        \</el-card\>
                    \</el-timeline-item\>
                    \<el-timeline-item timestamp="2018/4/3" placement="top" :hollow="true" type="warning"\>
                        \<el-card\>
                            \<h4\>黄河南路超出服务区域\</h4\>               
                        \</el-card\>
                    \</el-timeline-item\>
                    \<el-timeline-item timestamp="2018/4/2" placement="top" :hollow="true" type="danger"\>
                        \<el-card\>
                            \<h4\>6号机组异常断电\</h4\>

                        \</el-card\>
                    \</el-timeline-item\>
                \</el-timeline\>
            \</el-card\>
```

# 17.充电站监控页面开发

==views-chargingstation-Monitor.vue==

## 1.顶部静态结构开发

```vue
\<template\>
    \<el-card\>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<el-input v-model="formParams.input" placeholder="请输入站点名称、id"\>
                    \<template #append\>
                        \<el-select v-model="select" style="width: 115px"\>
                            \<el-option label="按名称查询" value="name" /\>
                            \<el-option label="按ID查询" value="id" /\>
                        \</el-select\>
                    \</template\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-select v-model="formParams.value" placeholder="充电站状态"\>
                    \<el-option :value="1" label="全部"\>\</el-option\>
                    \<el-option :value="2" label="使用中"\>\</el-option\>
                    \<el-option :value="3" label="空闲中"\>\</el-option\>
                    \<el-option :value="4" label="维护中"\>\</el-option\>
                    \<el-option :value="5" label="待维修"\>\</el-option\>
                \</el-select\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-button type="primary"\>查询\</el-button\>
                \<el-button\>重置\</el-button\>
            \</el-col\>
        \</el-row\>
    \</el-card\>
	\<el-card class="mt"\>
            \<el-row\>
                \<el-col :span="6"\>
                    \<el-statistic title="累计充电量(度)" :value="268900" /\>
                \</el-col\>
                \<el-col :span="6"\>
                    \<el-statistic title="累计充电次数(次)" :value="1389"\>\</el-statistic\>
                \</el-col\>
                \<el-col :span="6"\>
                    \<el-statistic title="服务区域(个)" :value="88" /\>
                \</el-col\>
                \<el-col :span="6"\>
                    \<el-statistic title="累计效益(元)" :value="5622178"\>
                    \</el-statistic\>
                \</el-col\>
            \</el-row\>
        \</el-card\>
 		 \<el-card class="mt"\>
            \<el-button type="primary" \>
                \<el-icon style="margin-right: 5px;"\>
                    \<Plus /\>
                \</el-icon\>
                新增充电站
            \</el-button\>
        \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { ref,reactive } from 'vue'
const formParams = reactive({
    input: "",
    value: 1
})
const select = ref("name")
\</script\>
```



## 2.表格开发

了解为基础表格结构之后，开发接口，获取表格数据

\> **mock接口开发：略，参见源文件**

\> **api文件封装**

==api-chargingstation.ts==

```ts
import { post } from "../utils/http"

interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number
}
enum Api {
    List = '/stationList',
  }
  function listApi(data:ListType){
    return post(Api.List,data)
}  
export {listApi}
```

==views-chargingstation-Monitor.vue==

```vue
\<script setup lang="ts"\>
import { ref, reactive,onMounted } from 'vue'
import { listApi } from "@/api/chargingstation"
const formParams = reactive({
    input: "",
    value: 1
})
const select = ref("name")
const loadData = async () =\> {
    const res = await listApi({page:1,pageSize:10,status:1});
    console.log(res)

}
onMounted(() =\> {
    loadData()
})

\</script\>
```

\> 添加table静态结构和分页静态结构

```vue
\<el-table :data="tableData" style="width: 100%"  v-loading="loading"\>
            \<el-table-column type="index" width="60" label="序号" /\>
            \<el-table-column prop="name" label="站点名称" width="200" /\>
            \<el-table-column prop="id" label="站点id" /\>
            \<el-table-column prop="city" label="所属城市" /\>
            \<el-table-column prop="fast" label="快充数" /\>
            \<el-table-column prop="slow" label="慢充数" /\>
            \<el-table-column prop="status" label="状态"\>
                \<template #default="scope"\>
                    \<el-tag v-if="scope.row.status == 2" type="primary"\>使用中\</el-tag\>
                    \<el-tag v-else-if="scope.row.status == 3" type="success"\>空闲中\</el-tag\>
                    \<el-tag v-else-if="scope.row.status == 4" type="warning"\>维护中\</el-tag\>
                    \<el-tag v-else-if="scope.row.status == 5" type="danger"\>待维修\</el-tag\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="now" label="正在充电" /\>
            \<el-table-column prop="fault" label="故障数" /\>
            \<el-table-column prop="person" label="站点负责人" /\>
            \<el-table-column prop="tel" label="负责人电话" /\>
            \<el-table-column label="操作" width="200"\>
                \<template #default="scope"\>
                    \<el-button type="primary" size="small"\>编辑\</el-button\>
                    \<el-popconfirm title="确定要删除吗" \>
                        \<template #reference\>
                            \<el-button type="danger" size="small"\>删除\</el-button\>
                        \</template\>
                    \</el-popconfirm\>
                \</template\>
            \</el-table-column\>
        \</el-table\>
		\<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
                :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
                :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\>
```

对应的ts

```vue
\<script setup lang="ts"\>
import { ref, reactive, onMounted } from 'vue'
import { listApi } from "@/api/chargingstation"
const formParams = reactive({
    input: "",
    value: 1
})
const select = ref("name")
const tableData = ref([]);
const loading = ref(false);
const totals = ref(0)
const pageInfo = reactive({
    page: 1,
    pageSize: 10
})
const loadData = async () =\> {
    loading.value = true
    const {data:{list,total}} = await listApi({ ...pageInfo, [select.value]: formParams.input, status: formParams.value });
    totals.value = total
    tableData.value = list
    loading.value = false
}
onMounted(() =\> {
    loadData()
})
const handleSizeChange = (size: number) =\> {
    pageInfo.pageSize = size
    loadData()
}
const handleCurrentChange = (page: number) =\> {
    pageInfo.page = page;
    loadData()
}
\</script\>
```

## 3.查询重置功能

```vue
 \<el-button type="primary" @click="loadData"\>查询\</el-button\>
 \<el-button @click="handleReset"\>重置\</el-button\>
```

重置：

```ts
const handleReset = () =\> {
    pageInfo.page = 1;
    pageInfo.pageSize = 10;
    formParams.input = ""
    formParams.value = 1
    select.value = "name"
    loadData()

}
```

## 4.新增/编辑充电站

==views-chargingstation-components-StationForm.vue==

```vue
\<template\>
    \<el-dialog title="编辑站点信息" :model-value="true"\>
        \<el-form :model="ruleForm" label-width="120" :rules="rules" ref="formRef"\>
            \<el-row\>
                \<el-col :span="12"\>
                    \<el-form-item label="站点名称：" prop="name"\>
                        \<el-input v-model="ruleForm.name" /\>
                    \</el-form-item\>
                    \<el-form-item label="站点id：" prop="id"\>
                        \<el-input v-model="ruleForm.id" :disabled="disabled" /\>
                    \</el-form-item\>
                    \<el-form-item label="所属城市：" prop="city"\>
                        \<el-input v-model="ruleForm.city" /\>
                    \</el-form-item\>
                    \<el-form-item label="站点负责人：" prop="person"\>
                        \<el-input v-model="ruleForm.person" /\>
                    \</el-form-item\>
                    \<el-form-item label="负责人电话：" prop="tel"\>
                        \<el-input v-model="ruleForm.tel" /\>
                    \</el-form-item\>
                \</el-col\>
                \<el-col :span="12"\>
                    \<el-form-item label="快充数：" prop="fast"\>
                        \<el-input v-model="ruleForm.fast" /\>
                    \</el-form-item\>
                    \<el-form-item label="慢充数：" prop="slow"\>
                        \<el-input v-model="ruleForm.slow" /\>
                    \</el-form-item\>
                    \<el-form-item label="充电站状态：" prop="status"\>
                        \<el-select v-model="ruleForm.status" placeholder="充电站状态" :disabled="disabled"\>
                            \<el-option :value="1" label="全部"\>\</el-option\>
                            \<el-option :value="2" label="使用中"\>\</el-option\>
                            \<el-option :value="3" label="空闲中"\>\</el-option\>
                            \<el-option :value="4" label="维护中"\>\</el-option\>
                            \<el-option :value="5" label="待维修"\>\</el-option\>
                        \</el-select\>
                    \</el-form-item\>
                    \<el-form-item label="正在充电：" prop="now"\>
                        \<el-input v-model="ruleForm.now" :disabled="disabled" /\>
                    \</el-form-item\>
                    \<el-form-item label="故障数：" prop="fault"\>
                        \<el-input v-model="ruleForm.fault" :disabled="disabled" /\>
                    \</el-form-item\>
                \</el-col\>
            \</el-row\>
        \</el-form\>

        \<template #footer\>
            \<div class="dialog-footer"\>
                \<el-button\>取消\</el-button\>
                \<el-button type="primary" \>
                    确认
                \</el-button\>
            \</div\>
        \</template\>
    \</el-dialog\>
\</template\>

\<script setup lang="ts"\>
import { ref,reactive} from 'vue'
import type { FormRules } from 'element-plus'
import type {RowType} from "../../../types/station"
const ruleForm = ref\<RowType\>({
    name: "",
    id: "",
    city: "",
    fast: "",
    slow: "",
    status: "",
    now: "",
    fault: "",
    person: "",
    tel: ""
})
const disabled = ref(false)
const rules = reactive\<FormRules\<RowType\>\>({
    name: [
        { required: true, message: '站点名称不能为空', trigger: 'blur' },
    ],
    id: [
        { required: true, message: '站点id不能为空', trigger: 'blur' },
    ],
    city: [
        { required: true, message: '所属城市不能为空', trigger: 'blur' },
    ],
    person: [
        { required: true, message: '站点负责人不能为空', trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '负责人电话不能为空', trigger: 'blur' },
    ],
    fast: [
        { required: true, message: '快充数不能为空', trigger: 'blur' },
    ],
    slow: [
        { required: true, message: '慢充数不能为空', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '充电站状态不能为空', trigger: 'blur' },
    ],
    now: [
        { required: true, message: '正在充电数不能为空', trigger: 'blur' },
    ],
    fault: [
        { required: true, message: '故障数量不能为空', trigger: 'blur' },
    ]
})
\</script\>
```

## 5.实现弹窗的开关功能

父组件中：

```vue
\<StationForm :dialog-visible="visible"\>\</StationForm\>
```

```ts
const visible = ref(false)
```

子组件中:

\> 这里没有选择使用v-model是因为这个数据是父组件传来的，不要双向绑定

```vue
 \<el-dialog :model-value="dialogVisible" :title="title" @close="handleCancel"\>
```

```ts
const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    }
})
```

\> 打开：

==父组件==

```vue
 \<el-button type="primary" size="small" @click="edit(scope.row)"\>编辑\</el-button\>
```

```ts
import type { RowType } from '@/types/station';
const edit = (row: RowType) =\> {
    visible.value = true;
}
```

\> 关闭：

==子组件==

```vue
 \<el-dialog title="编辑站点信息" :model-value="dialogVisible" @close="handleCancel"\> 
\<el-button @click="handleCancel"\>取消\</el-button\>
```

```ts
const emit = defineEmits(["close"])
const handleCancel = () =\> {
    emit("close")
}
```

==父组件：==

```vue
  \<StationForm  :dialog-visible="visible"  @close="visible = false"\>\</StationForm\>
```

现在有个小问题，如果你验证未通过直接关掉，下次打开会发现那个提示还在，可以通过下面设置解决

```vue
 \<el-dialog title="编辑站点信息" :model-value="dialogVisible" @close="handleCancel" destroy-on-close\>
```

## 6.实现编辑功能带入数据

涉及组件之间的传值，我们这里选择使用pinia,当然通过props也可以

==store-station.ts==

```ts
import { defineStore } from "pinia";
import { ref } from "vue"
import { RowType } from "@/types/station";
export const useStationStore = defineStore("station", () =\> {
    const rowData = ref\<RowType\>({
        name: "",
        id: "",
        city: "",
        fast: "",
        slow: "",
        status: "",
        now: "",
        fault: "",
        person: "",
        tel: ""
    });

    const setRowData = (row: RowType) =\> {
        rowData.value = row
        console.log("store",rowData.value)
    }
    return { rowData, setRowData }
})
```

==父组件==

```ts
import { useStationStore } from "@/stores/station";
```

```ts
const stationStore = useStationStore()
const { setRowData } = stationStore
const visible = ref(false)
const edit = (row: RowType) =\> {
    setRowData(row)
    visible.value = true;
}
```

==子组件==

```ts
import { useStationStore } from "@/store/station";
import { storeToRefs } from 'pinia';
const stationStore = useStationStore();
const { rowData } = storeToRefs(stationStore);
watch(() =\> props.dialogVisible, () =\> {
    // 等待 DOM 更新
    ruleForm.value = rowData.value
})
```

\> 有某些数据不能改，所以设置下

==子组件==

```ts
watch(() =\> props.dialogVisible, () =\> {
    // 等待 DOM 更新
    disabled.value = true
    ruleForm.value = rowData.value
})
```

## 7.新增充电站

```vue
 \<el-button type="primary" @click="handleAdd"\>
            \<el-icon style="margin-right: 5px;"\>
                \<Plus /\>
            \</el-icon\>
            新增充电站
        \</el-button\>
```

```ts
const handleAdd = () =\> {
    setRowData({
        name: "",
        id: "",
        city: "",
        fast: "",
        slow: "",
        status: "",
        now: "",
        fault: "",
        person: "",
        tel: ""
    })
    visible.value = true;
}
```

\> 取消禁用状态，动态设置标题

```vue
 \<el-dialog :title="title" :model-value="dialogVisible" @close="handleCancel" destroy-on-close\>
```

```ts
const title = ref("")
watch(() =\> props.dialogVisible, () =\> {
    // 等待 DOM 更新
    if (rowData.value.name) { //表示编辑
        title.value = "编辑充电站信息"
        disabled.value = true

    } else { // 表示新增
        title.value = "新增充电站"
        disabled.value = false
    }
    ruleForm.value = rowData.value

})
```



## 8.弹框表单确认事件

提交表单的接口:

==mock-index.ts==

```ts
//新增/编辑充电站
Mock.mock("https://www.demo.com/station/edit", 'post', (options: any) =\> {
  const res: any = JSON.parse(options.body);
  console.log("新增/编辑充电站接口收到数据："res)
  return {
    code: 200,
    success: true,
    data: "操作成功",
  };
});
```

==api-chargingstation.ts==

```ts
import { post } from "../utils/http"
import { RowType } from "@/types/station"
interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number
}
enum Api {
    List = '/stationList',
    Edit="/station/edit",
  }
  function listApi(data:ListType){
    return post(Api.List,data)
}  

function editApi(data:RowType):Promise\<any\>{
    return post(Api.Edit,data)
  }
  
export {listApi,editApi}
```

==子组件==

```vue
\<el-button type="primary" @click="handleConfirm"\>
                    确认
                \</el-button\>
```

```ts
const handleConfirm = () =\> {
    formRef.value?.validate(async (valid: boolean) =\> {
        if (valid) {
            //调用接口
            const res = await editApi(ruleForm.value);
            if (res.code == 200) {
                ElMessage({
                    message: res.data,
                    type: 'success',
                });
                handleCancel();
                emit("reload")
            }
        }
    })
}
```



==父组件==

```vue
 \<StationForm :dialog-visible="visible" @close="visible = false" @reload="loadData"\>\</StationForm\>
```

## 9.删除充电站

==mock-index.ts==

```ts
//删除充电站接口
Mock.mock("https://www.demo.com/station/delete", "post", (options: any) =\> {
  console.log(88, JSON.parse(options.body))
  return {
    code: 200,
    success: true,
    data: "操作成功",
  };
})
```

==api==

```ts
import { post } from "../utils/http"
import { RowType } from "@/types/station"
interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number
}
enum Api {
    List = '/stationList',
    Edit="/station/edit",
    Delete="/station/delete",
  }
  function listApi(data:ListType){
    return post(Api.List,data)
}  
function editApi(data:RowType):Promise\<any\>{
    return post(Api.Edit,data)
  }
  function deleteApi(id:string):Promise\<any\>{
    return post(Api.Delete,{id})
  }
export {listApi,editApi,deleteApi}
```



==父组件==

```vue
 \<el-popconfirm title="确定要删除吗"  @confirm="handleDelete(scope.row.id)"\>
```

```ts
import { ElMessage } from 'element-plus'
import { listApi,deleteApi } from "@/api/chargingstation"
const handleDelete = async (id: string) =\> {
    const res = await deleteApi(id);
    if (res.code == 200) { }
    ElMessage({
        message: res.data,
        type: 'success',
    });
    loadData()
}
```

# 18.营收统计页面开发

## 1.静态结构

```vue
 \<el-row :gutter="20"\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>今日总收入 (元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>239,824\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>本月总收入 (万元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>2,924\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>会员卡储值金额 (元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>239,824\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>服务费总金额 (元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>239,824\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>停车费总金额 (元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>239,824\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
            \<el-col :span="4"\>
                \<el-card\>
                    \<div class="title"\>
                        \<div class="round"\>
                            \<el-icon\>
                                \<Document /\>
                            \</el-icon\>
                        \</div\>
                        \<h4\>电费总金额 (元)\</h4\>
                    \</div\>
                    \<div class="total mt"\>
                        \<h1\>239,824\</h1\>
                        \<div class="percent"\>-21%\</div\>
                    \</div\>
                \</el-card\>
            \</el-col\>
        \</el-row\>
\<style lang="less" scoped\>
.title {
    display: flex;
    align-items: center;

    .round {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgb(235, 236, 245);
        text-align: center;
        line-height: 35px;
        margin-right: 20px;
    }

    h4 {
        color: #666;
    }
}

.total {
    display: flex;
    align-items: center;

    h1 {
        margin-right: 20px;
        font-size: 30px;
    }

    .percent {
        display: inline-block;
        padding: 3px 5px;
        height: 20px;
        color: green;
        font-size: 12px;
        background-color: rgb(235, 247, 239);
        border-radius: 2px;
        line-height: 20px;
    }
}
\</style\>
```

封装一个千分位分隔的功能

==utils-toThousands.ts==

```ts
function formatNumberToThousands(num: number): string {
    // 确保输入是数字
    if (isNaN(num)) {
        throw new Error("输入必须是一个有效的数字");
    }

    // 将数字转换为字符串并去掉小数点后的多余零
    const numString = num.toString().replace(/\.0$/, "");

    // 拆分成整数部分和小数部分
    const [integerPart, decimalPart] = numString.split("."); // 2345  7
    
    // 使用数组存储分隔后的整数部分
    let formattedInteger = "";
    
    // 反向遍历整数部分
    for (let i = integerPart.length - 1; i \>= 0; i--) { //2345   i=3
        // 将字符添加到格式化结果中   2345.7
        formattedInteger = integerPart[i] + formattedInteger;//5+""
        
        // 每隔3位添加逗号
        if ((integerPart.length - i) % 3 === 0 && i !== 0) {
            formattedInteger = "," + formattedInteger;
        }
    }

    // 如果有小数部分，则返回完整格式
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export default formatNumberToThousands
```

## 2.图表开发

```vue
\<el-card class="mt"\>
            \<div ref="chartRef" style="width: 100%; height: 240px;"\>\</div\>
        \</el-card\>
```

图表接口

==mock-index.ts==

```ts
//营收统计图表
Mock.mock("https://www.demo.com/revenueChart", "get", () =\> {
  return {
    code: 200,
    success: true,
    data: {
      list:[
        {
          name:"销售",
          data:[60, 40, 120, 140, 160, 80, 140]
        },
        {
          name:"访问量",
          data:[600, 400, 600, 700, 800, 400, 700]
        },

      ]
    }
  };
})
```

api接口

==api-chargingstation.ts==

```ts
import { post,get } from "../utils/http"
import { RowType } from "@/types/station"
interface ListType{
    page:number,
    pageSize:number,
    name?:string,
    id?:string,
    status:number
}
enum Api {
    List = '/stationList',
    Edit="/station/edit",
    Delete="/station/delete",
    RevenueChart="/revenueChart"
  }
  function listApi(data:ListType){
    return post(Api.List,data)
}  

function editApi(data:RowType):Promise\<any\>{
    return post(Api.Edit,data)
  }

  function deleteApi(id:string):Promise\<any\>{
    return post(Api.Delete,{id})
  }
  function chartApi(){
    return get(Api.RevenueChart)
  }
export {listApi,editApi,deleteApi,chartApi}
```

==revenue.vue==

```ts
import { chartApi } from "@/api/chargingstation"
import { reactive,ref } from "vue";
import { useChart } from "@/hooks/useChart.ts"
const chartRef=ref(null)
const setChartData = async () =\> {
    const chartOptions = reactive({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: []
        },
        xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
        },
        yAxis: [
            {
                type: 'value',
                name: '销售',
                position: 'left'
            },
            {
                type: 'value',
                name: '访问量',
                position: 'right'
            }
        ],
        series: [
            {
                name: '',
                type: 'bar',
                data: [],
                yAxisIndex: 0,
                itemStyle: {
                    color: '#409eff'
                }
            },
            {
                name: '',
                type: 'line',
                data: [],
                yAxisIndex: 1,
                itemStyle: {
                    color: '#409eff'
                },
                smooth: true
            }
        ]
    });
    const res = await chartApi();
    for (let i = 0; i \< res.data.list.length; i++) {
        chartOptions.series[i].name = res.data.list[i].name
        chartOptions.series[i].data = res.data.list[i].data
    }
    chartOptions.legend.data = res.data.list.map((item:any) =\> item.name)
    return chartOptions
}

useChart(chartRef, setChartData)
```

## 3.表格开发

表格接口

==Mock-index.ts==参见源文件

api

==api-chargingstation.ts==

```ts
  Revenue="/revenueList",

function revenueApi(data:any):Promise\<any\>{
  return post(Api.Revenue,data)
}
```



```vue
 \<el-card class="mt"\>
            \<el-input v-model="input" style="max-width: 400px" placeholder="输入站点名称筛选"\>
                \<template #append\>
                    \<el-button :icon="Search" @click="loadData"/\>
                \</template\>
            \</el-input\>
            \<el-table :data="tableData" class="mt" v-loading="loading"\>
                \<el-table-column type="index" width="60" label="序号" /\>
                \<el-table-column prop="name" label="充电站名称"  /\>
                \<el-table-column prop="id" label="充电站id"  /\>
                \<el-table-column prop="city" label="所属城市"  /\>
                \<el-table-column prop="count" label="充电桩总量(个)"  /\>
                \<el-table-column prop="day" label="单日总收入(元)" sortable\>
                    \<template #default="scope"\>
                        \<span\>{{ scope.row.day}}\</span\>
                        \<el-tag class="ml" :type="scope.row.percent\>0?'success':'danger'" \>{{ scope.row.percent\>0?"+"+scope.row.percent+"%":scope.row.percent+"%" }}\</el-tag\>
                    \</template\>
                \</el-table-column\>
                \<el-table-column prop="month" label="月度总收入(元)" \>
                    \<template #default="scope"\>
                        \<span\>{{scope.row.month }}\</span\>
                        \<el-tag class="ml" :type="scope.row.mpercent\>0?'success':'danger'" \>{{ scope.row.mpercent\>0?"+"+scope.row.mpercent+"%":scope.row.percent+"%" }}\</el-tag\>
                    \</template\>
                \</el-table-column\>
                \<el-table-column prop="electricity" label="电费营收(元)"  /\>
                \<el-table-column prop="parkingFee" label="停车费营收(元)"  /\>
                \<el-table-column prop="serviceFee" label="服务费营收(元)"  /\>
                \<el-table-column prop="member" label="会员储值金(元)"  /\>
                
            \</el-table\>
        \</el-card\>
```

```ts
import formatNumberToThousands from "@/utils/toThousands"
import { chartApi } from "@/api/chargingstation"
import { reactive,ref,onMounted } from "vue";
import { useChart } from "@/hooks/useChart.ts"
import {revenueApi} from "@/api/chargingstation"
const input = ref("")
const tableData=ref([]);
const loading = ref(false);
const loadData=async ()=\>{
    loading.value = true
    const { data:{list,total} } = await revenueApi({  name:input.value});
 //   setTotals(total);

      // 计算day字段
      tableData.value = list.map(item =\> ({
        ...item,
        day: item.electricity + item.parkingFee + item.serviceFee + item.member
    }));

    //tableData.value=data
    loading.value = false
}
onMounted(()=\>{
    loadData()
})
```

## 4.分页功能

我们考虑到不同页面分页功能好多东西都是一致的，所以我们去封装一个自定义组合式函数

==hooks-usePagination.ts==

```ts
import { ref, reactive } from "vue"
export function usePagaination(loadData:()=\>Promise\<any\>,initialPageSize=10) {
    const totals = ref(0)
    const pageInfo = reactive({
        page: 1,
        pageSize: initialPageSize
    })
    const handleSizeChange = (size: number) =\> {
        pageInfo.pageSize = size
        loadData()
    }
    const handleCurrentChange = (page: number) =\> {
        pageInfo.page = page;
        console.log(666,pageInfo.page)
        loadData()
    }
    const resetPagination = () =\> {
        pageInfo.page = 1;
        pageInfo.pageSize = initialPageSize;
      };
    const setTotals=(all:number)=\>{
        totals.value=all
    }  
      return{
        totals,setTotals,pageInfo,handleSizeChange,handleCurrentChange,resetPagination
      }
}
```

==revenue.vue==

```vue
 \<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
                :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
                :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\>
```

```ts
import {usePagaination} from "@/hooks/usePagaination"
const {
     totals,
     setTotals,
     pageInfo,
     handleSizeChange,
     handleCurrentChange,
     resetPagination
    }=usePagaination(loadData)
```

![image-20241025134256268](http://114.67.74.14/static/vue_project_assetsimage-20241025134256268.png)



# 19.充电桩管理页面开发

## 1.静态结构开发

```vue
\<template\>
   \<el-card\>
     \<el-select  style="width: 300px;" placeholder="选择站点名称"\>\</el-select\>
   \</el-card\>
   \<el-card class="mt"\>
    \<el-radio-group  size="large"\>
            \<el-radio-button label="全部" :value="0" /\>
            \<el-radio-button label="空闲中" :value="1" /\>
            \<el-radio-button label="充电中" :value="2" /\>
            \<el-radio-button label="连接中" :value="3" /\>
            \<el-radio-button label="排队中" :value="4" /\>
            \<el-radio-button label="已预约" :value="5" /\>
            \<el-radio-button label="故障/离线" :value="6" /\>
        \</el-radio-group\>
   \</el-card\>
   \<el-card class="mt"\>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<div class="item"\>
                    \<div class="pic"\>
                        \<p\>空闲中\</p\>
                        \<img :src="free" alt="" width="100px"\>
                        \<p\> 80%\</p\>
                    \</div\>
                    \<div class="info"\>
                        \<h3\>
                            CD1001
                        \</h3\>
                        \<hr class="mb"\>
                        \<p\>电压：314v\</p\>
                        \<p\>电流：212.2A\</p\>
                        \<p\>功率：21KW\</p\>
                        \<p\>温度：32°c\</p\>
                    \</div\>
                \</div\>
                \<div class="btn"\>
                    \<div class="divder"\>\</div\>
                    \<div\>
                        \<p class="fl ml" style="font-size: 12px;color: #999;"\>暂无预警\</p\>
                        \<div style="text-align: right;" class="fr"\>
                            \<el-button size="small"\>维保记录\</el-button\>
                            \<el-button type="primary" size="small" class="mr"\>使用记录\</el-button\>
                        \</div\>
                    \</div\>

                \</div\>
            \</el-col\>
        \</el-row\>
   \</el-card\>
\</template\>

\<script setup lang="ts"\>

import free from "@/assets/free.png"
\</script\>
\<style lang="less" scoped\>
.item {
    justify-content: center;
    background-color: rgb(247, 251, 254);
    height: 200px;
    border-radius: 10px 10px 0 0;
    padding: 20px;
    display: flex;
    align-items: center;
    margin-top: 20px;

    .pic {
        p {
            width: 76px;
            text-align: center;
            margin-bottom: 10px;
            color: rgb(61, 187, 146);
        }
    }

    .info {
        color: #999;
        margin-left: 30px;
        line-height: 26px;
        margin-top: -10px;
    }
}

.btn {
    background-color: #f7fbfe;
    width: 100%;
    height: 50px;
    line-height: 50px;

}

.divder {
    background-color: #f4f4f4;
    height: 2px;
    width: 95%;
    margin: auto;
}

.record {

    height: 60px;
    line-height: 60px;
    text-align: center;

    box-sizing: border-box;
}
\</style\>
```

## 2.对接接口

==mock ，见源文件==

==api-chargingstation.ts==

```ts
 CurrentList="currentList"
 function currentListApi(name:string):Promise\<any\>{
    return post(Api.currentList,{name})
  }
```

## 3.组件中实现搜索框模糊查询

\> 为el-select添加filterable属性即可启用搜索功能

```vue
\<el-select v-model="value" style="width: 300px;" placeholder="选择站点名称" filterable 
            :remote-method="remoteMethod"\>
            \<el-option v-for="item in optionsCopy" :key="item.id" :value="item.name"\>{{ item.name }}\</el-option\>
        \</el-select\>
```

```ts
\<script setup lang="ts"\>
import ing from "@/assets/ing.png"
import free from "@/assets/free.png"
import outline from "@/assets/outline.png"
import { currentListApi } from '@/api/chargingstation';
import {ref,onMounted} from "vue"
const value = ref("")
const options = ref\<any\>([])//存原始下拉框
let optionsCopy = ref\<any\>([]);//复制下拉框
const dataList = ref([]);//原始数据
let dataListCopy = ref([])//复制数据
const loadData = async (query = "") =\> {
    const { data } = await currentListApi(query);
    options.value = data
    dataList.value = data[0].list //默认加载第一个的数据
    dataListCopy.value = data[0].list
    optionsCopy.value = data;

}

onMounted(() =\> {
    loadData()
})
const loading = ref(false)
const remoteMethod = (query: string) =\> {
    optionsCopy.value = options.value //初始化
    optionsCopy.value = optionsCopy.value.filter(item =\> item.name.includes(query))
}
\</script\>
```

## 4.单选按钮组查询

```vue
\<el-card class="mt"\>
        \<el-radio-group v-model="radio" size="large" @change="handleChange"\>
            \<el-radio-button :label="`全部(${allCount})`" :value="0" /\>
            \<el-radio-button :label="`空闲中(${checkCount(1)})`" :value="1" /\>
            \<el-radio-button :label="`充电中(${checkCount(2)})`" :value="2" /\>
            \<el-radio-button :label="`连接中(${checkCount(3)})`" :value="3" /\>
            \<el-radio-button :label="`排队中(${checkCount(4)})`" :value="4" /\>
            \<el-radio-button :label="`已预约(${checkCount(5)})`" :value="5" /\>
            \<el-radio-button :label="`故障/离线(${checkCount(6)})`" :value="6" /\>
        \</el-radio-group\>
    \</el-card\>
```



```ts
const radio = ref(0)
const allCount = computed(() =\> checkCount(1) + checkCount(2) + checkCount(3) + checkCount(4) + checkCount(5) + checkCount(6))
function checkCount(num:number) {
    return dataList.value.filter((item:any) =\> item.status == num).length

}
const handleChange = (val: number) =\> {
    dataListCopy.value = dataList.value
    if (val != 0) {
        dataListCopy.value = dataListCopy.value.filter((item:any) =\> item.status == val)
    }
}
```



## 5.充电桩列表

```vue
 \<el-card class="mt"\>
        \<el-row :gutter="20"\>
            \<el-col :span="6" v-for="item in dataListCopy" :key="item.id"\>
                \<div class="item"\>
                    \<div class="pic"\>
                        \<p v-if="item.status == 1"\>空闲中\</p\>
                        \<p v-else-if="item.status == 2"\>充电中\</p\>
                        \<p v-else-if="item.status == 3"\>连接中\</p\>
                        \<p v-else-if="item.status == 4"\>排队中\</p\>
                        \<p v-else-if="item.status == 5"\>已预约\</p\>
                        \<p v-else-if="item.status == 6"\>故障/离线\</p\>
                        \<img :src="item.status == 1 ? free : (item.status == 6 ? outline : ing)" alt="" width="100px"\>
                        \<p v-if="item.status == 2"\>{{ item.percent }}\</p\>
                        \<p v-else\>0%\</p\>
                    \</div\>
                    \<div class="info"\>
                        \<h3\>
                            {{ item.id }}
                        \</h3\>
                        \<hr class="mb"\>
                        \<p\>电压：{{ item.voltage }}\</p\>
                        \<p\>电流：{{ item.current }}\</p\>
                        \<p\>功率：{{ item.power }}\</p\>
                        \<p\>温度：{{ item.tem }}\</p\>
                    \</div\>

                \</div\>

                \<div class="btn"\>
                    \<div class="divder"\>\</div\>
                    \<div\>
                        \<p class="fl ml" style="font-size: 12px;color: #999;"\>暂无预警\</p\>
                        \<div style="text-align: right;" class="fr"\>
                            \<el-button size="small"\>维保记录\</el-button\>
                            \<el-button type="primary" size="small" class="mr"\>使用记录\</el-button\>
                        \</div\>
                    \</div\>

                \</div\>

            \</el-col\>
        \</el-row\>
    \</el-card\>
```

```ts
watch(value, () =\> {
    const res = optionsCopy.value.filter(item =\> item.name == value.value);
    dataListCopy.value = res[0].list
    dataList.value = res[0].list
    radio.value = 0

})
```

添加浮框

```vue
                    \<div style="text-align: right;" class="fr"\>
                            \<el-button size="small"\>维保记录\</el-button\>
                            \<el-popover placement="top-start" title="使用记录" :width="200" trigger="hover"
                                content="本日使用记录"\>
                                \<template #reference\>
                                    \<el-button type="primary" size="small" class="mr"\>使用记录\</el-button\>
                                \</template\>
                                \<el-timeline style="max-width: 600px"\>
                                    \<el-timeline-item timestamp="12:08:17"\>
                                        充电80度，消费80元
                                    \</el-timeline-item\>
                                    \<el-timeline-item timestamp="13:12:09"\>
                                       re
                                    \</el-timeline-item\>
                                    \<el-timeline-item timestamp="13:15:22"\>
                                        充电60度，消费60元
                                    \</el-timeline-item\>
                                    \<el-timeline-item timestamp="16:22:33"\>
                                        充电70度，消费70元
                                    \</el-timeline-item\>
                                    \<el-timeline-item timestamp="17:27:17"\>
                                        充电100度，消费100元
                                    \</el-timeline-item\>
                                    \<el-timeline-item timestamp="18:08:33"\>
                                        充电80度，消费80元
                                    \</el-timeline-item\>
                                \</el-timeline\>
                            \</el-popover\>

                        \</div\>
```



# 20.电子地图页面开发

## 1.高德地图api

\> 高德地图官网中，选择js api

![image-20241028144021633](http://114.67.74.14/static/vue_project_assetsimage-20241028144021633.png)

\> 选择进阶教程，结合vue使用

![image-20241028144138642](http://114.67.74.14/static/vue_project_assetsimage-20241028144138642.png)

==components-Map-MapContainer.vue==

创建基础容器

```vue
\<template\>
  \<div id="container"\>\</div\>
\</template\>
```

添加样式

```vue
\<style scoped\>
#container {
  width: 100%;
  height: 80vh;
}
\</style\>
```

安装地图api

```powershell
npm i @amap/amap-jsapi-loader --save
```



根据文档介绍创建基础模板

```vue
\<template\>
    \<div id="container"\>\</div\>
\</template\>

\<script setup lang="ts"\>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, onUnmounted, ref } from "vue";
let map = null;
onMounted(() =\> {
  AMapLoader.load({
    key: "7066344199d5d8c8bd499c1d4bfc1984", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) =\> {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom:5, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
    })
    .catch((e) =\> {
      console.log(e);
    });
});

\</script\>

\<style lang="less" scoped\>
#container {
    width: 100%;
    height: 80vh;
}
\</style\>
```

==views-map-ElectronicMap.vue==

```vue
\<template\>
    \<el-row :gutter="20"\>

        \<el-col :span="18"\>
            \<el-card\>
                \<MapContainer /\>
            \</el-card\>
        \</el-col\>
        \<el-col :span="6"\>
        \</el-col\>
    \</el-row\>
\</template\>

\<script setup lang="ts"\>
import MapContainer from "@/components/Map/MapContainer.vue";
\</script\>
```



## 2.地图添加点标记

\> 1.创建mock文件：详见源文件

\> 2.创建api

==src-api-map.ts==

```ts
import { post } from "../utils/http"

enum Api{
    MapList="/mapList" 
}

function mapListApi():Promise\<any\>{
    return post(Api.MapList)
}

export{mapListApi}
```

==components-Map-MapContain.vue==

```vue
\<template\>
    \<div id="container"\>\</div\>
\</template\>

\<script setup lang="ts"\>
import AMapLoader from "@amap/amap-jsapi-loader";
import { onMounted, onUnmounted, ref } from "vue";
import icon from "../../assets/flashIcon.png";
import stationPic from "@/assets/station.jpg"
import { mapListApi } from "@/api/map.ts"
let map:any = null;
const markersData = ref\<any\>([])
onMounted(() =\> {

  AMapLoader.load({
    key: "7066344199d5d8c8bd499c1d4bfc1984", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then((AMap) =\> {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "3D", // 是否为3D地图模式
        zoom:5, // 初始化地图级别
        center: [116.397428, 39.90923], // 初始化地图中心点位置
      });
      mapListApi().then(({ data })=\> {
        markersData.value = data;
        // 创建信息窗体实例
        const infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -30), // 信息窗体的偏移量
        });

        // 添加自定义标记
        markersData.value.forEach((markerData:any) =\> {
          const marker = new AMap.Marker({
            position: markerData.position,
            title: markerData.title,
            icon: icon
          });

          // 添加点击事件
          marker.on('click', () =\> {
            infoWindow.setContent(`
              \<div style="display:flex;padding:10px;align-items:center;"\>
                  \<div\>
                    \<img src="${stationPic}" width="200px"/\>  
                  \</div\>
                  \<div style="width:180px;line-height:30px;margin-left:20px"\>
                    \<h3\>${markerData.title}\</h3\> 
                    \<p\>充电桩数量：${markerData.count}\</p\> 
                    \<p \>充电站状态：\<span style="color:blue"\>${markerData.status==1?"使用中":"维护中"}\</span\>\</p\> 
                  \</div\>
                 
                \</div\>
            `); // 设置窗体内容
            infoWindow.open(map, marker.getPosition()); // 在地图上打开信息窗体
          });

          marker.setMap(map); // 将标记添加到地图上
        });
      })
      

    })
    .catch((e) =\> {
      console.log(e);
    });
});
onUnmounted(() =\> {
  map?.destroy();
});
\</script\>

\<style lang="less" scoped\>
#container {
    width: 100%;
    height: 80vh;
}
.info-modal{
  display: flex;
  padding: 20px !important;
}
\</style\>
```



## 3.右侧表单开发

```vue
 \<el-col :span="6"\>
            \<el-card class="des"\>
                \<div\>1.累计充电站数量：\<el-text type="primary"\>34个\</el-text\>\</div\>
                \<div\>2.单省份最多充电桩：\<el-text type="primary"\>北京(4个)\</el-text\>\</div\>
                \<div\>3.充电站遍及省份：\<el-text type="primary"\>14个\</el-text\>\</div\>
                \<div\>4.暂无充电站省份：\<el-text type="primary"\>22个\</el-text\>\</div\>
                \<div\>5.累计充电站：\<el-text type="primary"\>北京(4个)\</el-text\>\</div\>
                \<div\>6.单日营收最高：\<el-text type="primary"\>北京西单充电站\</el-text\>\</div\>
                \<div\>7.单日营收最低：\<el-text type="primary"\>南宁青秀山充电站\</el-text\>\</div\>
                \<div\>8.故障率最高：\<el-text type="primary"\>兰州黄河桥充电站\</el-text\>\</div\>
            \</el-card\>
            \<el-card class="mt"\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<h3\>新增站点地图\</h3\>
                    \</div\>
                \</template\>
                \<el-form :model="form" style="max-width: 600px" label-width="85px"\>
                    \<el-form-item label="站点名称："\>
                        \<el-input v-model="form.name" /\>
                    \</el-form-item\>
                    \<el-form-item label="站点地址："\>
                        \<el-input v-model="form.name" /\>
                    \</el-form-item\>
                    \<el-form-item label="经度："\>
                        \<el-input v-model="form.name" /\>
                    \</el-form-item\>
                    \<el-form-item label="纬度："\>
                        \<el-input v-model="form.name" /\>
                    \</el-form-item\>
                    \<el-form-item label="立即使用："\>
                        \<el-switch v-model="form.delivery" /\>
                    \</el-form-item\>
                    \<el-form-item label="备注："\>
                        \<el-input v-model="form.desc" type="textarea" /\>
                    \</el-form-item\>
                    \<el-form-item\>
                        \<el-button type="primary" \>创建\</el-button\>
                        \<el-button\>清空\</el-button\>
                    \</el-form-item\>
                \</el-form\>

            \</el-card\>
        \</el-col\>

\<script setup lang="ts"\>
import MapContainer from "@/components/Map/MapContainer.vue";
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})
\</script\>
```



# 21.订单管理页面开发

## 1.静态结构搭建

```vue
\<template\>
    \<el-card\>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.orderNo" placeholder="请输入订单号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-select v-model="searchParams.status" placeholder="订单状态"\>
                    \<el-option :value="1" label="全部"\>\</el-option\>
                    \<el-option :value="2" label="进行中"\>\</el-option\>
                    \<el-option :value="3" label="已完成"\>\</el-option\>
                    \<el-option :value="4" label="异常"\>\</el-option\>
                \</el-select\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.no" placeholder="设备编号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-button type="primary"\>查询\</el-button\>
                \<el-button \>重置\</el-button\>
            \</el-col\>
            \<el-col :span="6" class="mt"\>
                \<el-input v-model="searchParams.name" placeholder="请输入站点名称"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6" class="mt"\>
                \<el-date-picker v-model="date" type="daterange" range-separator="/" value-format="YYYY-MM-DD"
                    @change="handleChange" start-placeholder="开始日期" end-placeholder="结束日期" /\>
            \</el-col\>
        \</el-row\>
    \</el-card\>
    \<el-card class="mt"\>
        \<el-button type="danger" \>批量删除\</el-button\>
        \<el-button type="primary" icon="Download"\>导出订单数据到Excel\</el-button\>
    \</el-card\>
    \<el-card class="mt"\>
        \<el-table \>
            \<el-table-column type="selection" width="55"\>\</el-table-column\>
            \<el-table-column type="index" label="序号" width="80" /\>
            \<el-table-column prop="orderNo" label="订单号" /\>
            \<el-table-column prop="equipmentNo" label="设备编号" /\>
            \<el-table-column prop="date" label="订单日期" /\>
            \<el-table-column prop="startTime" label="开始时间" /\>
            \<el-table-column prop="endTime" label="结束时间" /\>
            \<el-table-column prop="money" label="金额" /\>
            \<el-table-column prop="pay" label="支付方式" /\>
            \<el-table-column\>
                \<template #default="scope"\>
                    \<el-tag type="success" v-if="scope.row.status == 2"\>进行中\</el-tag\>
                    \<el-tag type="primary" v-else-if="scope.row.status == 3"\>已完成\</el-tag\>
                    \<el-tag type="warning" v-else-if="scope.row.status == 4"\>异常\</el-tag\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="opera" label="操作"\>
                \<template #default="scope"\>
                    \<el-button type="primary" size="small"\>
                        详情
                    \</el-button\>
                    \<el-button type="danger" size="small"\>
                        删除
                    \</el-button\>
                \</template\>
            \</el-table-column\>
        \</el-table\>
        \<!-- \<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\> --\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import {  ref } from "vue"
const date = ref(["", ""])
interface SearchType{
    orderNo: string
    status: number,
    no: string,
    startDate: string,
    endDate: string,
    name: string
}
const searchParams = ref\<SearchType\>({
    orderNo: "",
    status: 1,
    no: "",
    startDate: "",
    endDate: "", //不能写成date.value[0]
    name: ""
})

const handleChange = (val:string[]) =\> {
    searchParams.value.startDate = val[0]
    searchParams.value.endDate = val[1]
}
\</script\>
```

## 2.创建mock

==api-operations.ts==



## 3.封装自定义组合式函数优化

我们项目中有很多查询表格，很多操作都是类似的，可以优化吗，当然可以

下面可以封装一个组合式函数处理

==hooks-useHttp.ts==

```ts
import { ref, reactive, onMounted,unref } from "vue";
import { post } from "@/utils/http";

// Http 组合式函数
export function useHttp\<T\>(url: string, initialParams: any) {
    const dataList = ref\<T[]\>([]);
    const loading = ref\<boolean\>(false);
    const totals = ref(0);
    const pageInfo = reactive({
        page: 1,
        pageSize: 10,
    });
    // 加载数据的函数
    const loadData = async () =\> {

        loading.value = true;

        try {
            const { data } = await post(url, {...pageInfo,...unref(initialParams)});
           
            dataList.value = data.list;
            totals.value = data.total; // 假设返回总数

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            loading.value = false;
        }
    };
    // 在组件挂载时加载数据
    onMounted(() =\> {
        loadData();
    });

    const handleSizeChange = (size: number) =\> {
        console.log("handleSizeChange")
        pageInfo.pageSize = size;
        loadData();
    };

    const handleCurrentChange = (page: number) =\> {
        console.log("handleCurrentChange")
       pageInfo.page = page;
        loadData();
    };

    const resetPagination = () =\> {
        pageInfo.page = 1;
        pageInfo.pageSize = 10; 
        loadData();
    };

    return {
        dataList,
        loading,
        loadData,
        totals,
        pageInfo,
        handleSizeChange,
        handleCurrentChange,
        resetPagination,
    };
}
```

## 4.组件中直接使用

==Orders.vue==

```vue
\<template\>
    \<el-card\>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.orderNo" placeholder="请输入订单号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-select v-model="searchParams.status" placeholder="订单状态"\>
                    \<el-option :value="1" label="全部"\>\</el-option\>
                    \<el-option :value="2" label="进行中"\>\</el-option\>
                    \<el-option :value="3" label="已完成"\>\</el-option\>
                    \<el-option :value="4" label="异常"\>\</el-option\>
                \</el-select\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.no" placeholder="设备编号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-button type="primary" @click="loadData"\>查询\</el-button\>
                \<el-button @click="handleReset"\>重置\</el-button\>
            \</el-col\>
            \<el-col :span="6" class="mt"\>
                \<el-input v-model="searchParams.name" placeholder="请输入站点名称"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6" class="mt"\>
                \<el-date-picker v-model="date" type="daterange" range-separator="/" value-format="YYYY-MM-DD"
                    @change="handleChange" start-placeholder="开始日期" end-placeholder="结束日期" /\>
            \</el-col\>
        \</el-row\>
    \</el-card\>
    \<el-card class="mt"\>
        \<el-button type="danger" :disabled="!selectionList.length" @click="handleBatchDelete"\>批量删除\</el-button\>
        \<el-button type="primary" :disabled="!selectionList.length" icon="Download"\>导出订单数据到Excel\</el-button\>
    \</el-card\>
    \<el-card class="mt"\>
        \<el-table :data="dataList" v-loading="loading" @selection-change="handleSelectionChange"\>
            \<el-table-column type="selection" width="55"\>\</el-table-column\>
            \<el-table-column type="index" label="序号" width="80" /\>
            \<el-table-column prop="orderNo" label="订单号" /\>
            \<el-table-column prop="equipmentNo" label="设备编号" /\>
            \<el-table-column prop="date" label="订单日期" /\>
            \<el-table-column prop="startTime" label="开始时间" /\>
            \<el-table-column prop="endTime" label="结束时间" /\>
            \<el-table-column prop="money" label="金额" /\>
            \<el-table-column prop="pay" label="支付方式" /\>
            \<el-table-column prop="status" label="订单状态"\>
                \<template #default="scope"\>
                    \<el-tag type="success" v-if="scope.row.status == 2"\>进行中\</el-tag\>
                    \<el-tag type="primary" v-else-if="scope.row.status == 3"\>已完成\</el-tag\>
                    \<el-tag type="warning" v-else-if="scope.row.status == 4"\>异常\</el-tag\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="opera" label="操作"\>
                \<template #default="scope"\>
                    \<el-button type="primary" size="small"\>
                        详情
                    \</el-button\>
                    \<el-button type="danger" size="small"\>
                        删除
                    \</el-button\>
                \</template\>
            \</el-table-column\>
        \</el-table\>
        \<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import {  ref } from "vue"
import { useHttp } from "@/hooks/useHttp";
import { batchDeleteApi } from "@/api/operations"
import { ElMessage } from 'element-plus'
interface SearchType{
    orderNo: string,
    status: number,
    no: string,
    startDate: string,
    endDate: string,
    name: string
}
interface SelectionListType{
    orderNo:string,
    equipmentNo:string,
    date:string,
    startTime:string,
    endTime:string,
    money:string,
    pay:string,
    status:number
}
const date = ref(["", ""])
const searchParams = ref\<SearchType\>({
    orderNo: "",
    status: 1,
    no: "",
    startDate: "",
    endDate: "", //不能写成date.value[0]
    name: ""
})
const { dataList, loading,  resetPagination, loadData, totals, pageInfo, handleSizeChange, handleCurrentChange } = useHttp\<SelectionListType\>("/orderList", searchParams);
const handleChange = (val:string[]) =\> {
    searchParams.value.startDate = val[0]
    searchParams.value.endDate = val[1]
}
const handleReset = () =\> {
    date.value = ["", ""]
    searchParams.value = {
        orderNo: "",
        status: 1,
        no: "",
        startDate: "",
        endDate: "",

        name: ""
    }
    resetPagination()
}



const selectionList = ref\<SelectionListType[]\>([])
const handleSelectionChange = (selection:any) =\> {
    selectionList.value = selection

}

const handleBatchDelete = async () =\> {
    const res = await batchDeleteApi(selectionList.value.map((item:SelectionListType) =\> item.orderNo))
    if (res.code == 200) {
        ElMessage({
            message: res.data,
            type: 'success',
        });
        loadData()
    }
}
\</script\>
```

## 5.表格添加多选功能

![image-20241028180750829](http://114.67.74.14/static/vue_project_assetsimage-20241028180750829.png)

```ts
const selectionList = ref([])
const handleSelectionChange = (selection) =\> {
    selectionList.value = selection

}
```

## 6.设置两个按钮的禁用状态

```vue
\<el-card class="mt"\>
        \<el-button type="danger" :disabled="!selectionList.length" @click="handleBatchDelete"\>批量删除\</el-button\>
        \<el-button type="primary" :disabled="!selectionList.length" :icon="Download"
            @click="exportToExcel"\>导出订单数据到Excel\</el-button\>
    \</el-card\>
```

## 7.批量删除功能

批量删除接口

==mock-index.ts==

```ts
//订单管理-批量删除接口
Mock.mock('https://www.demo.com/batchDelete', "post", (options: any) =\> {
  const { order } = JSON.parse(options.body)
  console.log(JSON.stringify(order))
  return {
    code: 200,
    message: "成功",
    data: "操作成功"
  }
})
```

==api-operations.ts==

```ts
import { post } from "../utils/http"
enum Api {
  BatchDelete='/batchDelete',
  }
  function batchDeleteApi(order:[]):Promise\<any\>{
    return post(Api.BatchDelete,{order})
  }
export {batchDeleteApi}
```



```ts
import { batchDeleteApi } from "@/api/operations"
import { ElMessage } from 'element-plus'
const handleBatchDelete = async () =\> {
    const res = await batchDeleteApi(selectionList.value.map((item:SelectionListType) =\> item.orderNo))
    if (res.code == 200) {
        ElMessage({
            message: res.data,
            type: 'success',
        });
        loadData()
    }
}
```

## 8.订单详情页面

==Detail.vue==

```vue
\<template\>

    \<el-card class="mt"\>
        \<el-descriptions :title="`订单编号:${$route.query.orderNo}`"\>
            \<el-descriptions-item label="订单编号"\>{{$route.query.orderNo}}\</el-descriptions-item\>
            \<el-descriptions-item label="设备编号"\>C2274\</el-descriptions-item\>
            \<el-descriptions-item label="订单日期"\>2024-10-01\</el-descriptions-item\>
            \<el-descriptions-item label="站点名称"\>
                \<el-tag size="small"\>北京西单充电站\</el-tag\>
            \</el-descriptions-item\>
            \<el-descriptions-item label="开始时间"\>
               08:00:23
            \</el-descriptions-item\>
            \<el-descriptions-item label="结束时间"\>09:10:11\</el-descriptions-item\>
            \<el-descriptions-item label="订单金额(元)"\>66.5\</el-descriptions-item\>
            \<el-descriptions-item label="支付方式"\>支付宝\</el-descriptions-item\>
            \<el-descriptions-item label="所属城市"\>北京\</el-descriptions-item\>

            \<el-descriptions-item label="充电量(度)"\>86\</el-descriptions-item\>
            \<el-descriptions-item label="充电设备"\>充电桩(快充)\</el-descriptions-item\>
            \<el-descriptions-item label="充电总时长(小时)"\>2\</el-descriptions-item\>
            \<el-descriptions-item label="负责人姓名"\>王科\</el-descriptions-item\>
            \<el-descriptions-item label="负责人电话"\>18888888888\</el-descriptions-item\>
            \<el-descriptions-item label="维保人员姓名"\>刘来\</el-descriptions-item\>
            \<el-descriptions-item label="维保人员电话"\>17777777777\</el-descriptions-item\>
            \<el-descriptions-item label="订单状态"\>已完成\</el-descriptions-item\>
            \<el-descriptions-item label="服务费(元)"\>8.0\</el-descriptions-item\>
            \<el-descriptions-item label="停车费(元)"\>4.0\</el-descriptions-item\>
            \<el-descriptions-item label="电费(元)"\>54.0\</el-descriptions-item\>
            \<el-descriptions-item label="收费信息"\>
                电费+服务费+停车费，高峰时段费用位2.3元1度，停车费2元/小时，服务费5元/次
            \</el-descriptions-item\>
            \<el-descriptions-item label="备注"\>暂无\</el-descriptions-item\>
        \</el-descriptions\>
    \</el-card\>


\</template\>
\<script setup\>


\</script\>
```

## 9.跳转至订单详情功能

==Orders.vue==

```vue
 \<el-button type="primary" size="small" @click="handleDetail(scope.row.orderNo)"\>
                        详情
                    \</el-button\>
```

```ts
import { useTabsStore } from '@/store/tabs';
import { useRouter, useRoute } from "vue-router";
const router = useRouter()
const tabsStore = useTabsStore();
const { addTab, setCurrentTab } = tabsStore;
const handleDetail = (orderNo) =\> {
    addTab("订单详情", "/operations/detail", "Share")
    setCurrentTab("订单详情", "/operations/detail",)
    router.push("/operations/detail?orderNo=" + orderNo)
}
```

## 10.解决详情页返回缓存问题

==layouts-TabsLayout.vue==

添加缓存，取代掉原本的\<RouterView/\>

```vue
 \<!-- \<RouterView /\> --\>
    \<RouterView v-slot="{ Component }"\>
        \<KeepAlive\>
            \<component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" /\>
        \</KeepAlive\>
        \<component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" /\>
    \</RouterView\>
```

==router-basicRouterMap.ts==

给订单页面添加需要缓存标记

```ts
 {
                path: "/operations/orders",
                name: "orders",
                component: () =\> import("@/views/operations/Orders.vue"),
                meta: {
                    keepAlive: true
                }

            },
```

\> 如果从别的页面返回而不是从详情页返回，那么应该重新加载数据

```ts
const route = useRoute()
watch(() =\> route.name, (to, from) =\> {
    console.log(to,from)
    if (to == "orders" && from != "detail") {
        console.log(222)
        loadData()
    }

});
```



## 11.导出订单数据到excel

1.安装

```pow
npm install xlsx file-saver
```

```vue
 
\<el-button type="primary" :disabled="!selectionList.length" :icon="Download"
            @click="exportToExcel"\>导出订单数据到Excel\</el-button\>
```

```ts
// 导入所需的库
import * as XLSX from 'xlsx'; // 导入 xlsx 库，用于处理 Excel 文件
import { saveAs } from 'file-saver'; // 导入 file-saver 库，用于保存文件

// 定义导出到 Excel 的函数
const exportToExcel = () =\> {
    // 将选择的数据（selectionList.value）转换为工作表格式
    const ws = XLSX.utils.json_to_sheet(selectionList.value);

    // 创建一个新的工作簿（Workbook）
    const wb = XLSX.utils.book_new();

    // 将工作表（ws）追加到工作簿（wb）中，并命名为 'Sheet1'
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // 将工作簿（wb）写入输出格式，这里选择了 'xlsx' 格式，并以 'array' 类型输出
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // 创建一个新的 Blob 对象，并将输出数据放入其中，设置 MIME 类型为 'application/octet-stream'
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // 使用 file-saver 库的 saveAs 函数，导出并下载 Excel 文件，指定文件名为 '导出数据.xlsx'
    saveAs(blob, '导出数据.xlsx');
}
```

# 22.计费管理页面开发

## 1.基本搜索框开发

```vue
\<template\>
    \<el-row :gutter="20"\>
        \<el-col :span="6"\>
            \<el-card\>
                \<el-input style="width:80%" placeholder="请输入关键词" v-model="filterText"\>
                    \<template #append\>
                        \<el-button icon="Search" /\>
                    \</template\>
                \</el-input\>
            \</el-card\>
        \</el-col\>
        \<el-col :span="18"\>\</el-col\>
    \</el-row\>
\</template\>

\<script setup lang="ts"\>
import {ref} from "vue"
const filterText = ref('')
\</script\>
```

## 2.设置接口数据

mock接口：见源文件

\> api

==api-operation.ts==

```ts
import { post,get } from "../utils/http"
enum Api {
    CityList='/cityList'
  }
  function cityListApi():Promise\<any\>{
    return get(Api.CityList)
  }
export {listApi,batchDeleteApi,cityListApi}
```

==views-operation-Total.vue==

```vue
\<template\>
    \<el-row :gutter="20"\>
        \<el-col :span="6"\>
            \<el-card\>
                \<el-input style="width:80%" placeholder="请输入关键词" v-model="filterText"\>
                    \<template #append\>
                        \<el-button icon="Search" /\>
                    \</template\>
                \</el-input\>
                \<el-tree style="max-width: 600px" :data="treeData" :props="defaultProps"
                    show-checkbox ref="treeRef" class="mt" /\>
            \</el-card\>
        \</el-col\>
        \<el-col :span="18"\>\</el-col\>
    \</el-row\>
\</template\>

\<script setup lang="ts"\>
import {ref,onMounted} from "vue"
import { cityListApi } from '@/api/operations';
interface Tree {
    label: string
    children?: Tree[]
}
const defaultProps = {
    children: 'children',
    label: 'label',
}
const filterText = ref('')
const treeData = ref\<Tree[]\>([])
onMounted(async () =\> {
    const { data } = await cityListApi()
    treeData.value = data
})
\</script\>
```

## 3.tree组件过滤功能

\> `InstanceType` 是 TypeScript 的一个内置类型，它用来获取构造函数类型的实例类型。在你的代码 `const treeRef = ref\<InstanceType\<typeof ElTree\>\>()` 中，`ElTree` 是一个 Vue 组件（通常是一个类或函数），`typeof ElTree` 表达式返回这个组件的类型。

![image-20241029194335424](http://114.67.74.14/static/vue_project_assetsimage-20241029194335424.png)

![image-20241029194356193](http://114.67.74.14/static/vue_project_assetsimage-20241029194356193.png)

data表示的是每一条数据，返回false则节点会隐藏

## 4.计费模板开发

\> 基础结构

\> 关于:prop="'date.' + index + '.date1'" 拼接问题

`'date.' + index + '.date1'` 的作用是动态生成表单项的 `prop` 属性，以便与 Element Plus 的表单校验机制相连。下面是详细解释：

### 作用

1. **动态生成 `prop`**：`prop` 属性用于链接表单项和其在 `ruleForm` 对象中的字段。通过拼接字符串，可以为每个动态生成的时间区间创建一个唯一的标识。例如：
   - 当 `index` 是 0 时，`prop` 变为 `'date.0.date1'`，指向 `ruleForm.date[0].date1`。
   - 当 `index` 是 1 时，`prop` 变为 `'date.1.date1'`，指向 `ruleForm.date[1].date1`。
2. **与校验规则关联**：Element Plus 会使用这个 `prop` 来查找对应的字段，并基于 `rules` 中的定义来进行校验。

```vue
\<el-col :span="18"\>
            \<el-card\>
                \<template #header\>
                    \<div class="card-header"\>
                        \<span\>{{title}}\</span\>
                    \</div\>
                \</template\>
                \<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="demo-ruleForm"
                    status-icon\>
                    \<el-form-item label="模版名称" prop="name"\>
                        \<el-input v-model="ruleForm.name" style="max-width: 200px" /\>
                    \</el-form-item\>
                    \<div v-for="(timeSlot, index) in ruleForm.date" :key="index"\>
                        \<el-form-item :label="'时间区间' + (index + 1) + ':'" required\>
                            \<el-col :span="8"\>
                                \<el-form-item :prop="'date.' + index + '.date1'"\>
                                    \<el-time-picker v-model="timeSlot.date1" type="date" aria-label="开始时间"
                                        placeholder="开始时间" style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                            \<el-col class="text-center" :span="1"\>
                                \<span class="text-gray-500"\>-\</span\>
                            \</el-col\>
                            \<el-col :span="8"\>
                                \<el-form-item :prop="'date.' + index + '.date2'"\>
                                    \<el-time-picker v-model="timeSlot.date2" aria-label="结束时间" placeholder="结束时间"
                                        style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                            \<el-col :span="6"\>
                                \<el-form-item label="电费：" :prop="'electricity.' + index"\>
                                    \<el-input v-model="timeSlot.electricity" style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                        \</el-form-item\>
                    \</div\>
                    \<el-button type="primary" class="mb" @click="addTimeSlot"\>添加时间区间\</el-button\>
                    \<el-form-item label="服务费" prop="service"\>
                        \<el-input v-model="ruleForm.service" style="max-width: 200px" /\>
                    \</el-form-item\>
                    \<el-form-item label="停车费" prop="parking"\>
                        \<el-input v-model="ruleForm.parking" style="max-width: 200px" /\>
                    \</el-form-item\>
                    \<el-form-item label="特殊备注" prop="remarks"\>
                        \<el-input v-model="ruleForm.remarks" type="textarea" /\>
                    \</el-form-item\>
                    \<el-form-item\>
                        \<el-button type="primary" @click="submitForm(ruleFormRef)"\>
                            创建
                        \</el-button\>
                        \<el-button @click="resetForm"\>重置\</el-button\>
                    \</el-form-item\>
                \</el-form\>
            \</el-card\>
        \</el-col\>
```

```vue
\<script setup lang="ts"\>
import {ref,onMounted,watch,reactive} from "vue"
import { cityListApi } from '@/api/operations';
import { ElTree } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
/*计费模板开发*/
const title=ref("计费模板")
interface RuleForm {
    date:  Array\<{ date1: string; date2: string; electricity: string }\>,
    name: string,
    service: string,
    parking: string,
    remarks: string
}
const ruleFormRef = ref\<FormInstance\>()
const ruleForm = ref\<RuleForm\>({
    date: [{ date1: '', date2: '', electricity: '' }],
    name: '',
    service: "",
    parking: "",
    remarks: ""
})
const rules = reactive\<FormRules\<RuleForm\>\>({
    name: [
        { required: true, message: '请输入模板名称', trigger: 'blur' },
    ],
    service:[
        { required: true, message: '请输入服务费', trigger: 'blur' },
    ],
    parking:[
        { required: true, message: '请输入停车费', trigger: 'blur' },
    ],
    remarks:[
        { required: true, message: '请输入备注', trigger: 'blur' },
    ],
})

const addTimeSlot = () =\> {
    ruleForm.value.date.push({ date1: '', date2: '', electricity: '' })
}
const submitForm = async (formEl: FormInstance | undefined) =\> {
    if (!formEl) return
    await formEl.validate((valid, fields) =\> {
        if (valid) {
            console.log(8787, ruleForm)
            console.log('submit!')
        } else {
            console.log('error submit!', fields)
        }
    })
}

const resetForm = () =\> {
    ruleForm.value = {
        date: [{ date1: '', date2: '', electricity: '' }],
        name: 'Hello',
        service: "",
        parking: "",
        remarks: ""
    }
}
\</script\>
```



## 5.实现动态规则验证

```vue
\<div v-for="(timeSlot, index) in ruleForm.date" :key="index"\>
                        \<el-form-item :label="'时间区间' + (index + 1) + ':'" required\>
                            \<el-col :span="8"\>
                                \<el-form-item :prop="'date.' + index + '.date1'" :rules="{required: true,message: '时间不能为空',trigger: 'blur'}"\>
                                    \<el-time-picker v-model="timeSlot.date1" type="date" aria-label="开始时间"
                                        placeholder="开始时间" style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                            \<el-col class="text-center" :span="1"\>
                                \<span class="text-gray-500"\>-\</span\>
                            \</el-col\>
                            \<el-col :span="8"\>
                                \<el-form-item :prop="'date.' + index + '.date2'" :rules="{required: true,message: '时间不能为空',trigger: 'blur'}"\>
                                    \<el-time-picker v-model="timeSlot.date2" aria-label="结束时间" placeholder="结束时间"
                                        style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                            \<el-col :span="6"\>
                                \<el-form-item label="电费：" :prop="'electricity.' + index" :rules="{required: true,message: '时间不能为空',trigger: 'blur'}"\>
                                    \<el-input v-model="timeSlot.electricity" style="width: 100%" /\>
                                \</el-form-item\>
                            \</el-col\>
                        \</el-form-item\>
                    \</div\>
```

## 6.树状图和右边联动

```vue
 \<el-tree style="max-width: 600px" :data="treeData" :props="defaultProps" @node-click="handleNodeClick"
                    show-checkbox ref="treeRef" :filter-node-method="filterNode" class="mt" /\>
```



```ts
const handleNodeClick = (data: Tree) =\> {
    if(!data.children){
        title.value=data.label
        resetForm()
    }
}
```



# 23.报警管理页面开发

```vue
\<template\>
     \<el-card\>
        \<el-radio-group v-model="radio1" size="large" class="mt"\>
            \<el-radio-button label="严重告警" :value="1" /\>
            \<el-radio-button label="紧急告警" :value="2" /\>
            \<el-radio-button label="重要告警" :value="3" /\>
            \<el-radio-button label="一般告警" :value="4" /\>
        \</el-radio-group\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { ref} from 'vue'
const radio1 = ref\<number\>(1)
\</script\>
```

## 1.接口开发

==api-alarm.ts==

```ts
import {get } from "../utils/http"
enum Api {
    alarmList="/alarmList"
  }
function alarmListApi():Promise\<any\>{
    return get(Api.alarmList)
}

export{ alarmListApi }
```

==views-alarm-Alarm.vue==

```vue
\<template\>
     \<el-card\>
        \<el-radio-group v-model="radio1" size="large" class="mt"\>
            \<el-radio-button label="严重告警" :value="1" /\>
            \<el-radio-button label="紧急告警" :value="2" /\>
            \<el-radio-button label="重要告警" :value="3" /\>
            \<el-radio-button label="一般告警" :value="4" /\>
        \</el-radio-group\>
    \</el-card\>
    \<el-card class="mt" v-for="item in alarmList" :key="item.equNo"\>
        \<el-alert :title="`${item.address}充电站充电异常！`" type="warning" show-icon class="mb"\>
        \</el-alert\>
        \<el-descriptions direction="vertical" :column="4" border\>
            \<el-descriptions-item v-for="(val, key) in item" :label="getLabel(key)"\>
                \<el-tag :type="val == 1 ? 'danger' : (val == 2 ? 'warning' : 'info')" v-if="key == 'level'"\>
                    {{ val == 1 ? '严重' : (val == 2 ? '紧急' : '一般') }}
                \</el-tag\>
                \<el-link type="danger" v-else-if="key == 'status'"\>
                    {{ val == 1 ? "待指派" : "处理中" }}
                \</el-link\>
                \<span v-else\>
                    {{ val }}
                \</span\>

            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-if="item.status == 1"\>
                \<el-button type="primary" @click="handleOpen"\>指派\</el-button\>
            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-else-if="item.status == 2"\>
                \<el-button type="warning" @click="handleOpen"\>催办\</el-button\>
            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-else\>
                \<el-button type="primary" @click="handleOpen"\>查看\</el-button\>
            \</el-descriptions-item\>
        \</el-descriptions\>

    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { ref,onMounted} from 'vue'
import { alarmListApi } from '@/api/alarm';
import { getLabel } from './fieldLabelMap';
interface AlarmListType{
    description: string,
    address: string,
    equNo: string,
    level: number,
    time: string,
    code: number,
    status: number,
}
const alarmList = ref\<AlarmListType[]\>([]);
onMounted(async () =\> {
    const { data } = await alarmListApi();
    alarmList.value = data
})
const radio1 = ref\<number\>(1)
\</script\>
```

因为后端返回的字段都是英文名称，但是显示要显示为对应的中文，所以创建映射表

==views-alarm-fieldLabelMap.ts==

\> **Tips:**
\>
\> `Record\<string, string\>` 是一个工具类型，用于定义一个对象类型，其中的键是字符串，值也是字符串

```ts
const fieldLabelMap: Record\<string, string\> = {
    description: '故障描述',
    address: '设备地址',
    equNo: '设备号',
    status: '当前状态',
    time: '故障时间',
    level: '告警级别',
    code: '故障代码',
    // 其他字段映射
  };
  
  const getLabel = (key: string): string =\> {
    return fieldLabelMap[key] || key; // 返回映射的中文标签或默认字段名
  };
  export {getLabel}
```

## 2.二次封装elementplus组件，实现分部组件

\> 核心逻辑

1.通过插槽让用户传入若干form,至少两个，至多三个

2.点击下一步需要校验表单，需要通过父组件传入表单实例，调用表单validate方法进行校验，

3.提交数据，需要子组件触发父组件的函数，调用提交表单数据方法，通过emit实现



==components-StepForm.vue==

```vue
\<template\>
    \<div style="max-width: 600px;"\>
        \<el-steps :active="currentStep" align-center finish-status="success"\>
            \<el-step v-for="(step, index) in steps" :key="index" :title="step.title"\>\</el-step\>
        \</el-steps\>
        \<div v-if="currentStep === 0" class="mt"\>
            \<slot name="step-1"\>\</slot\>
        \</div\>
        \<div v-if="currentStep === 1" class="mt"\>
            \<slot name="step-2"\>\</slot\>
        \</div\>
        \<div v-if="currentStep === 2" class="mt"\>
            \<slot name="step-3"\>\</slot\>
        \</div\>
        \<div class="step-buttons"\>
            \<el-button @click="prevStep" v-if="currentStep \> 0"\>上一步\</el-button\>
            \<el-button type="primary" @click="nextStep"\>
                {{ currentStep === steps.length - 1 ? '提交' : '下一步' }}
            \</el-button\>
        \</div\>
    \</div\>
\</template\>

\<script lang="ts" setup\>
import { ref } from 'vue';
const props = defineProps(["steps", "form1", "form2", "form3"])
const emit = defineEmits(["handleSubmit"])
const currentStep = ref(0);
const nextStep = async () =\> {
    if (currentStep.value == 0) {
        props.form1.validate((valid: boolean) =\> {
            if (valid) {
                if (currentStep.value \< props.steps.length - 1) {
                    currentStep.value++;
                } else {
                    // 提交逻辑
                   emit("handleSubmit")
                }
            }
        })
    } else if (currentStep.value == 1) {
        props.form2?.validate((valid: boolean) =\> {
            if (valid) {
                if (currentStep.value \< props.steps.length - 1) {
                    currentStep.value++;
                } else {
                    // 提交逻辑
                    emit("handleSubmit")
                }
            }
        })
    } else {
        if (props.form3) {
            props.form3.validate((valid: boolean) =\> {
                if (valid) {
                    if (currentStep.value \< props.steps.length - 1) {
                        currentStep.value++;
                    } else {
                        // 提交逻辑
                        emit("handleSubmit")
                    }
                }
            })
        } else {
            emit("handleSubmit")
        }

    }

};
const prevStep = () =\> {
    if (currentStep.value \> 0) {
        currentStep.value--;
    }
};
\</script\>

\<style scoped\>
.step-buttons {
    margin-top: 20px;
}
\</style\>
```

==views-alarm-Alarm.vue==

```vue
\<template\>
    \<el-card\>
        \<el-radio-group v-model="radio1" size="large" class="mt"\>
            \<el-radio-button label="严重告警" :value="1" /\>
            \<el-radio-button label="紧急告警" :value="2" /\>
            \<el-radio-button label="重要告警" :value="3" /\>
            \<el-radio-button label="一般告警" :value="4" /\>
        \</el-radio-group\>
    \</el-card\>
    \<el-card class="mt" v-for="item in alarmList" :key="item.equNo"\>
        \<el-alert :title="`${item.address}充电站充电异常！`" type="warning" show-icon class="mb"\>
        \</el-alert\>
        \<el-descriptions direction="vertical" :column="4" border\>
            \<el-descriptions-item v-for="(val, key) in item" :label="getLabel(key)"\>
                \<el-tag :type="val == 1 ? 'danger' : (val == 2 ? 'warning' : 'info')" v-if="key == 'level'"\>
                    {{ val == 1 ? '严重' : (val == 2 ? '紧急' : '一般') }}
                \</el-tag\>
                \<el-link type="danger" v-else-if="key == 'status'"\>
                    {{ val == 1 ? "待指派" : "处理中" }}
                \</el-link\>
                \<span v-else\>
                    {{ val }}
                \</span\>

            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-if="item.status == 1"\>
                \<el-button type="primary" @click="drawer = true"\>指派\</el-button\>
            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-else-if="item.status == 2"\>
                \<el-button type="warning" @click="drawer = true"\>催办\</el-button\>
            \</el-descriptions-item\>
            \<el-descriptions-item label="操作" v-else\>
                \<el-button type="primary" @click="drawer = true"\>查看\</el-button\>
            \</el-descriptions-item\>
        \</el-descriptions\>

    \</el-card\>
    \<el-drawer v-model="drawer" title="报警任务指派"\>

        \<StepForm :steps="steps" :form1="form1" :form2="form2" :form3="form3" @handle-submit="handleSubmit"\>
            \<template #step-1\>
                \<el-form :model="formData.basicInfo" :rules="basicInfoRules" ref="form1"\>
                    \<el-form-item label="姓名" prop="name"\>
                        \<el-input v-model="formData.basicInfo.name"\>\</el-input\>
                    \</el-form-item\>
                    \<el-form-item label="电话" prop="tel"\>
                        \<el-input v-model="formData.basicInfo.tel"\>\</el-input\>
                    \</el-form-item\>
                    \<el-form-item label="邮箱" prop="email"\>
                        \<el-input v-model="formData.basicInfo.email"\>\</el-input\>
                    \</el-form-item\>
                    \<el-form-item label="工号" prop="no"\>
                        \<el-input v-model="formData.basicInfo.no"\>\</el-input\>
                    \</el-form-item\>
                    \<el-form-item label="是否加急："\>
                        \<el-switch v-model="formData.basicInfo.urgent" /\>
                    \</el-form-item\>
                    \<el-form-item label="其他选项："\>
                        \<el-checkbox-group v-model="formData.basicInfo.other"\>
                            \<el-checkbox value="换设备" name="equ"\>
                                更换设备
                            \</el-checkbox\>
                            \<el-checkbox value="仅维修" name="repiar"\>
                                仅维修
                            \</el-checkbox\>
                            \<el-checkbox value="需拍照片" name="photo"\>
                                需拍照片
                            \</el-checkbox\>
                            \<el-checkbox value="Simple brand exposure" name="doc"\>
                                需报备
                            \</el-checkbox\>
                        \</el-checkbox-group\>
                    \</el-form-item\>
                    \<el-form-item label="其他备注信息"\>
                        \<el-input type="textarea" /\>
                    \</el-form-item\>
                \</el-form\>
            \</template\>
            \<template #step-2\>
                \<el-form :model="formData.shenpi" :rules="addressRules" ref="form2"\>
                    \<el-form-item label="审批部门" prop="a"\>
                        \<el-select placeholder="请选择审批部门" v-model="formData.shenpi.a"\>
                            \<el-option label="总裁办" value="1"\> \</el-option\>
                            \<el-option label="运营部" value="2"\> \</el-option\>
                            \<el-option label="维修部" value="3"\> \</el-option\>
                            \<el-option label="市场部" value="4"\> \</el-option\>
                            \<el-option label="财务部" value="5"\> \</el-option\>
                        \</el-select\>
                    \</el-form-item\>
                    \<el-form-item label="抄送部门" prop="b" \>
                        \<el-select placeholder="请选择抄送部门"  v-model="formData.shenpi.b"\>
                            \<el-option label="总裁办" value="1"\> \</el-option\>
                            \<el-option label="运营部" value="2"\> \</el-option\>
                            \<el-option label="维修部" value="3"\> \</el-option\>
                            \<el-option label="市场部" value="4"\> \</el-option\>
                            \<el-option label="财务部" value="5"\> \</el-option\>
                        \</el-select\>
                    \</el-form-item\>
                \</el-form\>
            \</template\>
            \<template #step-3\>
                \<el-form :model="formData.address" :rules="addressRules2" ref="form3"\>
                    \<el-form-item label="负责人姓名" prop="person"\>
                        \<el-input v-model="formData.address.person"\>\</el-input\>
                    \</el-form-item\>
                    \<el-form-item label="负责人电话" prop="tel"\>
                        \<el-input v-model="formData.address.tel"\>\</el-input\>
                    \</el-form-item\>
                \</el-form\>
            \</template\>
        \</StepForm\>
        \<el-result icon="warning" title="设备编号：CD1001" sub-title="该任务已催促2次，请抓紧处理"\>
            \<template #extra\>
                \<el-button type="primary"\>我已知晓\</el-button\>
            \</template\>
        \</el-result\>
    \</el-drawer\>
\</template\>

\<script setup lang="ts"\>
import { ref, onMounted } from 'vue'
import { alarmListApi } from '@/api/alarm';
import { getLabel } from './fieldLabelMap';
import StepForm from "@/components/StepForm/StepForm.vue"
import { FormInstance } from 'element-plus';
interface AlarmListType {
    description: string,
    address: string,
    equNo: string,
    level: number,
    time: string,
    code: number,
    status: number,
}
const alarmList = ref\<AlarmListType[]\>([]);
onMounted(async () =\> {
    const { data } = await alarmListApi();
    alarmList.value = data
})
const radio1 = ref\<number\>(1)
const drawer = ref(false);
const form1=ref\<FormInstance\>()
const form2=ref\<FormInstance\>()
const form3=ref\<FormInstance\>()
const steps = [
    { title: '基本信息' },
    { title: '审批信息' },
    { title: '日期信息' }
];

const formData = ref({
    basicInfo: {
        name: '',
        email: '',
        tel: '',
        no: '',
        other: [],
        urgent: true
    },
    shenpi: {
        a: '',
        b: ''
    },
    address:{
        person:"",
        tel:"",
    }
});
const basicInfoRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    no: [{ required: true, message: '请输入工号', trigger: 'blur' }],
    tel: [{ required: true, message: '请输入电话', trigger: 'blur' }],
};
const addressRules = {
    a: [{ required: true, message: '不能为空', trigger: 'blur' }],
    b: [{ required: true, message: '不能为空', trigger: 'blur' }]
};
const addressRules2 = {
    person: [{ required: true, message: '不能为空', trigger: 'blur' }],
    tel: [{ required: true, message: '不能为空', trigger: 'blur' }]
};

const handleSubmit=()=\>{
    console.log(formData.value)
}
\</script\>
```

优化写法

```ts
\<script lang="ts" setup\>
import { ref } from "vue"
const currentStep = ref\<number\>(0)
const props = defineProps(["steps", "form1", "form2", "form3"])

const forms = [props.form1, props.form2, props.form3];

const prevStep = () =\> {
    if (currentStep.value \> 0) {
        currentStep.value--
    }
}

const nextStep = () =\> {
    const currentForm = forms[currentStep.value];

    currentForm.validate((valid: boolean) =\> {
        if (valid) {
            if (currentStep.value \< props.steps.length - 1) {
                currentStep.value++
            } else {
                console.log("提交表单")
            }
        }
    })
}
\</script\>
```



# 24.会员卡管理

```vue
\<template\>
    \<el-card  \>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.no" placeholder="请输入会员卡号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.tel" placeholder="请输入手机号"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.name" placeholder="请输入姓名"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-button type="primary" @click="loadData"\>查询\</el-button\>
                \<el-button @click="handleReset"\>重置\</el-button\>
            \</el-col\>
        \</el-row\>
    \</el-card\>
    \<el-card class="mt" \>
        \<el-table :data="dataList" v-loading="loading"\>
            \<el-table-column type="index" label="序号" width="80" /\>
            \<el-table-column prop="memberCardNumber" label="会员卡号"\>\</el-table-column\>
            \<el-table-column prop="cardType" label="卡类型"\>\</el-table-column\>
            \<el-table-column prop="issueDate" label="开卡日期"\>\</el-table-column\>
            \<el-table-column prop="holderName" label="持有人姓名"\>\</el-table-column\>
            \<el-table-column prop="holderPhone" label="持有人电话"\>\</el-table-column\>
            \<el-table-column prop="cardBalance" label="卡余额"\>\</el-table-column\>
            \<el-table-column prop="transactionRecords" label="消费记录"\>
                \<template #default="scope"\>
                    \<el-popover placement="top-start" title="消费记录" :width="260" trigger="hover"
                        content="this is content, this is content, this is content"\>
                        \<template #reference\>
                            \<el-button class="m-2"\>{{ scope.row.transactionDate }}日消费\</el-button\>
                        \</template\>
                        \<el-timeline style="max-width: 600px"\>
                            \<el-timeline-item v-for="(item, index) in scope.row.transactionRecords" :key="index" color="#0bbd87"
                                :timestamp="item.transactionDate"\>
                              \<p\> 消费金额：{{item.transactionAmount }} \</p\>
                              \<p\>消费类型：{{ item.transactionType }}\</p\>
                            \</el-timeline-item\>
                        \</el-timeline\>
                    \</el-popover\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="validUntil" label="有效期至"\>\</el-table-column\>
        \</el-table\>
        \<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\>
    \</el-card\>
\</template\>

\<script setup\>
import { ref } from 'vue';
import { useHttp } from '@/hooks/useHttp';

const searchParams = ref({
    no: "",
    tel: "",
    name: ""
})
const { dataList, loading, resetPagination, loadData, totals, pageInfo, handleSizeChange, handleCurrentChange } = useHttp("/member", searchParams);

\</script\>

\<style\>\</style\>
```

# 25.招商管理

mock接口

```ts
//招商管理分类列表接口
Mock.mock('https://www.demo.com/document',"get",()=\>{
  return {
    code:200,
    message:"操作成功",
    data:{
      type:["招商类","广告类","公告类","提示类","日常类","告警类","其他"],//文章类型
      important:["一级","二级","三级","四级"],//重要程度
      publish:["站内信","公众号","小程序","H5","官网"]//发布渠道
    }
  }
})
```

api文件

```ts
import { get } from "../utils/http"
enum Api{
    TypeList="/document" 
}
function typeListApi(){
    return get(Api.TypeList)
}
export{typeListApi}
```



静态结构开发

==document.vue==

```vue
\<template\>
    \<el-card\>
        \<div class="mt"\>
            \<span class="title"\>文章类型:\</span\>
            \<el-tag type="primary" class="mr"\>全部\</el-tag\>
            \<el-tag type="info" class="mr" v-for="item in typeList.type" :key="item"\>{{ item }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>重要程度:\</span\>
            \<el-tag type="primary" class="mr"\>全部\</el-tag\>
            \<el-tag type="info" class="mr" v-for="item in typeList.important" :key="item"\>{{ item }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>发布渠道:\</span\>
            \<el-tag type="primary" class="mr"\>全部\</el-tag\>
            \<el-tag type="info" class="mr" v-for="item in typeList.publish" :key="item"\>{{ item }}\</el-tag\>
        \</div\>
        \<el-divider /\>
        \<div class="mt"\>
            \<span class="title"\>已选:\</span\>
            \<el-tag type="success" class="mr" closable\>全部\</el-tag\>
        \</div\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { typeListApi } from "@/api/document";

import { onMounted, ref } from "vue";
interface ListType {
    type: string[],
    important: string[],
    publish: string[]
}
const typeList = ref\<ListType\>({ type: [], important: [], publish: [] })

onMounted(async () =\> {
    const { data } = await typeListApi();
    typeList.value = data
})
\</script\>

\<style lang="less" scoped\>
.title {
    font-size: 14px;
    display: inline-block;
    width: 80px;
}
\</style\>
```

## 2.点击高亮功能实现

\> **高亮实现思路：**
\>
\> 如果只是一个列表，要想实现高亮，我们会设置一个currentIndex值，每次点击的时候更新这个currentIndex值,
\>
\> 然后在元素中只需要判断他们的index和currentIndex相等，那就说明是当前点击的元素，就让他高亮
\>
\> 现在我们有三个类别，所以需要三个currentIndex，所以我们设置一个数组，直接存三个currentIndex



\> 点击的时候我们规定两个参数，第一个参数就是index，因为从0开始，但是我们默认要让 全部 这两个字高亮，所以可以设置-1就是全部两个字高亮，
\>
\> 第二个参数是类别号，第一个类别就是0，第二个类别就是1，使用0 1 2当类别标记的好处是我们可以直接用他当作角标，能够在currentIndex数组中修改
\>
\> 对应的标记



```vue
\<template\>
    \<el-card\>
        \<div class="mt"\>
            \<span class="title"\>文章类型:\</span\>
            \<el-tag :type="currentIndex[0]==-1?'primary':'info'"  class="mr" @click="handleSelect(-1,0)"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[0]==index?'primary':'info'" class="mr" v-for="(item,index) in typeList.type" :key="item" @click="handleSelect(index,0)"\>{{ item }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>重要程度:\</span\>
            \<el-tag :type="currentIndex[1]==-1?'primary':'info'"  class="mr" @click="handleSelect(-1,1)"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[1]==index?'primary':'info'" class="mr" v-for="(item,index) in typeList.important" :key="item" @click="handleSelect(index,1)"\>{{ item }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>发布渠道:\</span\>
            \<el-tag :type="currentIndex[2]==-1?'primary':'info'"  class="mr" @click="handleSelect(-1,2)"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[2]==index?'primary':'info'" class="mr" v-for="(item,index) in typeList.publish" :key="item" @click="handleSelect(index,2)"\>{{ item }}\</el-tag\>
        \</div\>
        \<el-divider /\>
        \<div class="mt"\>
            \<span class="title"\>已选:\</span\>
            \<el-tag type="success" class="mr" closable\>全部\</el-tag\>
        \</div\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { typeListApi } from "@/api/document";

import { onMounted, ref } from "vue";
interface ListType {
    type: string[],
    important: string[],
    publish: string[]
}
const typeList = ref\<ListType\>({ type: [], important: [], publish: [] })

onMounted(async () =\> {
    const { data } = await typeListApi();
    typeList.value = data
})

const currentIndex=ref([-1,-1,-1])

const handleSelect=(index:number,num:number)=\>{
    console.log(index)
    currentIndex.value[num]=index
}
\</script\>

\<style lang="less" scoped\>
.title {
    font-size: 14px;
    display: inline-block;
    width: 80px;
}
.el-tag{
    cursor: pointer;
}
\</style\>
```

## 3.完整功能实现

```vue
\<template\>
    \<el-card\>
        \<div class="mt"\>
            \<span class="title"\>文章类型:\</span\>
            \<el-tag :type="currentIndex[0] == -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 0, '')"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[0] == index ? 'primary' : 'info'" class="mr"
                v-for="(item, index) in typeList.type" :key="item" @click="handleSelect(index, 0, item)"\>{{ item
                }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>重要程度:\</span\>
            \<el-tag :type="currentIndex[1] == -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 1, '')"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[1] == index ? 'primary' : 'info'" class="mr"
                v-for="(item, index) in typeList.important" :key="item" @click="handleSelect(index, 1, item)"\>{{ item
                }}\</el-tag\>
        \</div\>
        \<div class="mt"\>
            \<span class="title"\>发布渠道:\</span\>
            \<el-tag :type="currentIndex[2] == -1 ? 'primary' : 'info'" class="mr"
                @click="handleSelect(-1, 2, '')"\>全部\</el-tag\>
            \<el-tag :type="currentIndex[2] == index ? 'primary' : 'info'" class="mr"
                v-for="(item, index) in typeList.publish" :key="item" @click="handleSelect(index, 2, item)"\>{{ item
                }}\</el-tag\>
        \</div\>
        \<el-divider /\>
        \<div class="mt"\>
            \<span class="title"\>已选:\</span\>
            \<el-tag 
                disable-transitions 
                type="success" 
                class="mr"
                 v-for="item in selectedList" 
                 :key="item.name"
                 @close="handleClose(item.num)"
                closable\>{{ item.name }}\</el-tag\>
        \</div\>
    \</el-card\>
\</template\>

\<script setup lang="ts"\>
import { typeListApi } from "@/api/document";

import { onMounted, ref } from "vue";
interface ListType {
    type: string[],
    important: string[],
    publish: string[]
}
const typeList = ref\<ListType\>({ type: [], important: [], publish: [] })
const selectedList = ref\<any\>([]);//要求格式为 {num:1,name:"招商类"}
onMounted(async () =\> {
    const { data } = await typeListApi();
    typeList.value = data
})

const currentIndex = ref([-1, -1, -1])
//index表示点击的tag的序号 num表示第几个品类，name表示点击的tag的内容
const handleSelect = (index: number, num: number, name: string) =\> {
    // 查找数组中与 newObj.num 相等的对象的索引
    const ind: number = selectedList.value.findIndex((item: any) =\> item.num === num);

    if (!name) {
        //如果点的是全部,删掉对应的那项，也就是筛选出留下 除了点全部那一品类的数据
        selectedList.value = selectedList.value.filter((item: any) =\> item.num != num)
    } else {
        if (ind == -1) {//找不到相同num的，证明同品类没有，就添加
            selectedList.value.push({ num, name })
        } else {
            selectedList.value[ind] = { num, name }//否则直接替换
        }
    }
    currentIndex.value[num] = index;//应该让第几个高亮
}
const handleClose=(num:number)=\>{
    selectedList.value = selectedList.value.filter((item: any) =\> item.num != num);
    currentIndex.value[num]=-1 //让对应的品类回到全部 高亮
}
\</script\>

\<style lang="less" scoped\>
.title {
    font-size: 14px;
    display: inline-block;
    width: 80px;
}

.el-tag {
    cursor: pointer;
}
\</style\>
```

## 4.富文本编辑器

Vue3中常见的富文本编辑器：

- TinyMCE 
-  Quill
-  CKEditor  
- wangeditor5

TinyMCE的官网

https://www.tiny.cloud/docs/tinymce/latest/

## 1.安装

```powershell
npm install --save "@tinymce/tinymce-vue@^5"
```

## 2.详细配置

```vue
 \<el-card class="mt"\>
        \<Editor   ref="editorRef" v-model="EditorContent" api-key="xvbamfm2vokka8qoim9r801qtdlldskjschd51yha7zhuusp" :init="{language:'zh_CN'}" /\>
    \</el-card\>

\<script\>
import Editor from '@tinymce/tinymce-vue'
const editorRef = ref(null); // 定义一个 ref 来引用编辑器实例
const EditorContent = ref('')
const getEditorContent = () =\> {
  console.log(897,EditorContent.value)

};
\</script\>
```

\> 常见配置项

1. **初始化设置**:
   - `language`：设置编辑器的语言，如 `zh_CN`。
   - `height`：设置编辑器的高度。
   - `width`：设置编辑器的宽度。
   - `selector`：选择要初始化的编辑器元素。
2. **工具栏配置**:
   - `toolbar`：定义显示在工具栏上的按钮，如 `undo redo | styleselect | bold italic | link image`。
3. **菜单配置**:
   - `menubar`：控制菜单栏的显示，值可以是 `false`（不显示）或菜单名称的组合，如 `file edit view insert format tools table`。
4. **插件配置**:
   - `plugins`：启用需要的插件，例如 `lists link image code`。插件提供额外的功能。
5. **内容样式**:
   - `content_css`：指定内容区域的 CSS 文件，可以自定义编辑器内显示的样式。
6. **格式化选项**:
   - `formats`：定义自定义格式，例如指定某些 HTML 标签的样式。
7. **事件监听**:
   - 可以在 `init` 中添加事件监听，例如 `setup` 中定义 `editor.on('change', ...)` 来处理内容变化。
8. **图像和文件上传**:
   - 通过设置 `images_upload_url` 和相关处理，允许用户上传图像。
9. **自定义键盘快捷键**:
   - 可以通过 `setup` 方法自定义键盘快捷键，例如：`editor.addShortcut('Ctrl+Z', 'Undo', function () { console.log('Undo action'); });`。
10. **代码视图**:
    - 可以启用代码编辑功能，设置 `code` 插件，并添加到工具栏。

示例配置：

```vue
\<Editor
  ref="editorRef"
  v-model="EditorContent"
  api-key="xvbamfm2vokka8qoim9r801qtdlldskjschd51yha7zhuusp"
  :init="{
    language: 'zh_CN',
    height: 500,
    menubar: false,
    toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | link image | code',
    plugins: 'lists link image code',
    content_css: '/path/to/custom.css',
    setup: (editor) =\> {
      editor.on('change', () =\> {
        this.EditorContent = editor.getContent();
      });
    }
  }"
/\>
```

## 3.导出html功能

```vue
 \<el-button type="primary" class="mt" @click="getEditorContent"\>生成word文件\</el-button\>
```

Blob 对象是前端 Web API 中的一种数据类型，用于表示二进制数据的大块内容。Blob 代表“Binary Large Object”，它可以存储各种格式的数据，比如图片、音频、视频等。



将用户生成的数据包装成一个 Blob，然后通过创建一个临时的链接并触发下载操作，让用户可以下载该数据为一个文件

```ts
const getEditorContent = () =\> {
 // 获取编辑器内容
      // 创建一个 Blob 对象
      const blob = new Blob([EditorContent.value], { type: 'text/html' });
      // 创建一个链接元素
      const link = document.createElement('a');
      // 将 Blob 对象的 URL 设置为链接地址
      link.href = URL.createObjectURL(blob);
      // 设置下载文件的名称
      link.download = 'document.html';
      // 触发点击事件以下载文件
      link.click();
      // 释放 URL 对象
      URL.revokeObjectURL(link.href);
};
```



# 26.系统设置页面

基本结构开发

```vue
\<template\>
    \<el-card\>
        \<el-row :gutter="20"\>
            \<el-col :span="6"\>
                \<el-input v-model="searchParams.name" placeholder="请输入姓名"\>
                \</el-input\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-select placeholder="请选择部门" v-model="searchParams.department"\>
                    \<el-option label="全部" value=""\>\</el-option\>
                    \<el-option label="总裁办" value="总裁办"\>\</el-option\>
                    \<el-option label="技术部" value="技术部"\>\</el-option\>
                    \<el-option label="市场部" value="市场部"\>\</el-option\>
                    \<el-option label="维修部" value="维修部"\>\</el-option\>
                    \<el-option label="运营部" value="运营部"\>\</el-option\>
                    \<el-option label="客服部" value="客服部"\>\</el-option\>
                \</el-select\>
            \</el-col\>
            \<el-col :span="6"\>
                \<el-button type="primary" @click="loadData"\>查询\</el-button\>
                \<el-button\>重置\</el-button\>
            \</el-col\>
        \</el-row\>
    \</el-card\>
    \<el-card class="mt"\>
        \<el-table :data="dataList" v-loading="loading" class="mt"\>
            \<el-table-column type="index" label="序号" width="80" /\>
            \<el-table-column prop="account" label="账号"\>\</el-table-column\>
            \<el-table-column prop="name" label="姓名"\>\</el-table-column\>
            \<el-table-column prop="phone" label="电话"\>\</el-table-column\>
            \<el-table-column prop="idNo" label="身份证号"\>\</el-table-column\>
            \<el-table-column prop="position" label="职位"\>
                \<template #default="scope"\>
                    \<el-tag\>{{ scope.row.position }}\</el-tag\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="department" label="部门"\>\</el-table-column\>
            \<el-table-column prop="pageAuthority" label="页面权限"\>
                \<template #default="scope"\>
                    \<el-tag type="success"\>{{ scope.row.pageAuthority }}\</el-tag\>
                \</template\>
            \</el-table-column\>
            \<el-table-column prop="btnAuthority" label="按钮权限"\>
                \<template #default="scope"\>
                    \<el-tag type="info"\>{{ scope.row.btnAuthority }}\</el-tag\>
                \</template\>
            \</el-table-column\>

            \<el-table-column prop="opera" label="操作" width="280"\>
                \<template #default="scope"\>
                    \<el-button type="primary" size="small" \>
                        权限设置
                    \</el-button\>
                    \<el-button type="danger" size="small"\>
                        删除
                    \</el-button\>
                    \<el-button type="danger" size="small"\>
                        禁用
                    \</el-button\>
                \</template\>
            \</el-table-column\>
        \</el-table\>
\<el-pagination class="fr mt mb" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize"
        :page-sizes="[10, 20, 30, 40]" :background="true" layout="total, sizes, prev, pager, next, jumper"
        :total="totals" @size-change="handleSizeChange" @current-change="handleCurrentChange" /\>
    \</el-card\>
    
\</template\>

\<script setup lang="ts"\>
import { ref } from 'vue';
import { useHttp } from '@/hooks/useHttp';
const searchParams = ref({
    name: "",
    department: ""
})
const { dataList, loading,  loadData, totals, pageInfo, handleSizeChange, handleCurrentChange } = useHttp("/permissionList", searchParams);
\</script\>
```

## 1.权限弹窗组件开发

### 1.定义基本结构

==system-AuthModal.vue==

```vue
\<template\>
    \<el-dialog :model-value="visible" title="权限设置" width="600px"\>
        权限弹窗
    \</el-dialog\>
\</template\>
\<script setup lang="ts"\>
const props = defineProps({
    visible: Boolean,

})
\</script\> 
```

==system-System.vue==

```vue
  \<AuthModal :visible="visible"/\>
```

```ts
import AuthModal from "./AuthModal.vue"
const visible = ref(true);
```

### 2.添加获取当前用户权限接口

mock设置：

```ts
const userMenulist = [
  {
    name: "数据看板",
    url: "/dashboard",
    icon: "DataLine"
  },
  {
    name: "充电站管理",
    url: "/chargingstation",
    icon: "Lightning",
    children: [
      {
        name: "充电站监控",
        url: "/chargingstation/monitor",
        icon: "VideoCamera"
      },

      {
        name: "充电桩管理",
        url: "/chargingstation/fault",
        icon: "Warning"
      }
    ]
  },
  {
    name: "电子地图",
    url: "/map",
    icon: "MapLocation"
  },

  {
    name: "报警管理",
    url: "/alarm",
    icon: "Phone"
  },

  {
    name: "会员卡管理",
    url: "/equipment",
    icon: "Magnet"
  },
  {
    name: "个人中心",
    url: "/personal",
    icon: "User"
  },
]
//获取当前用户权限
Mock.mock("https://www.demo.com/userAuth","post",(req:any)=\>{
 //console.log(234,req.body)
 const {pageAuthority}=JSON.parse(req.body)
  console.log("后端收到当前权限",pageAuthority)
  return {
    code:200,
    message:"操作成功",
    data:{
      list:pageAuthority=="user"? userMenulist:(pageAuthority=="manager"?menulist2:menulist),
      btn:pageAuthority=="user"?['add']:(pageAuthority=="manager"?['add',"edit"]:['add',"edit","all","delete"])
    }
  }
})
```



api设置

==api-system.ts==

```ts
import { post } from "../utils/http"
enum Api {
    auth = '/userAuth', 
}
function getAuthApi(pageAuthority:string):Promise\<any\> {
    return post(Api.auth, {pageAuthority})
}

export {getAuthApi}
```

### 3.获取权限数据

==System.vue==

```vue
\<el-button type="primary" size="small"   @click="settingAuth(scope.row.pageAuthority)"\>
                        权限设置
  \</el-button\>
```

```ts
const settingAuth = async (pageAuthority:string) =\> {
    const { data: { list, btn } } = await getAuthApi(pageAuthority);
   console.log(list,btn)
}
```

### 4.在树图中先把所有的菜单渲染出来

==AuthModal.vue==

```vue
\<template\>
    \<el-dialog :model-value="visible" title="权限设置" width="600px"\>
        \<el-card\>
            \<template #header\>
                \<div class="card-header"\>
                    \<span\>页面权限\</span\>
                \</div\>
            \</template\>
            \<el-tree ref="treeRef" style="max-width: 600px" node-key="url" show-checkbox :data="treeData"
                @check-change="handleCheckChange" :check-on-click-node="true" /\>
        \</el-card\>
    \</el-dialog\>
\</template\>
\<script setup lang="ts"\>
import { storeToRefs } from "pinia"
import { useUserStore } from "@/store/auth"
import { transformData } from "@/utils/transformMenu"
import {ref} from "vue"
const props = defineProps({
    visible: Boolean,
})
const userStore=useUserStore()
const { menu } = storeToRefs(userStore) ;
const treeData = ref(transformData(menu.value));
const treeRef = ref()
const handleCheckChange = () =\> {
    console.log('checked keys:', treeRef.value.getCheckedKeys());
  
};
\</script\> 
```

\> 因为menu中的数据跟Tree组件要求的数组格式不一致，所以我们这里封装一个函数,处理menu数据，将其转为Tree组件需要的格式

==utils-transformMenu.ts==

```ts
function transformData(nodes:any) {
    return nodes.map((node:any) =\> {
        const newNode:any = {
            label: node.name,
            url: node.url, //需要用到url是因为要作为tree组件的node-key来使用
           // icon: node.icon
        };
        if (node.children) {
            newNode.children = transformData(node.children);
        }
        return newNode;
    });
}

export {transformData}
```

### 5.页面中获取当前权限的菜单数据

\> 同理，获取到的数据是一个嵌套的数组对象，我们要动态设置菜单的勾选，我们只需要一个一维的数组，这样就可以设置对应的节点勾选
\>
\> 因此也需要用到一个工具函数，将嵌套的二维或多维数组转成一维，即数组扁平化

```ts
import type { MenuItem } from '@/types/user';
import { transformData } from "@/utils/transformMenu"


const checkedKeys = ref\<string[]\>([])

function collectUrls(tree:MenuItem[]) {
  const urls:string[] = [];
  function traverse(node:MenuItem) {
    if (node.url&&!node.children) {
        urls.push(node.url);
    }
    if (node.children) {
      node.children.forEach((child:MenuItem) =\> traverse(child));
    }
  }
  tree.forEach((node:MenuItem) =\> traverse(node));
  return urls;
}

const settingAuth = async (pageAuthority:string) =\> {
    const { data: { list, btn } } = await getAuthApi(pageAuthority);
    checkedKeys.value = collectUrls(list)
    visible.value = true
    console.log(99,checkedKeys.value)
}
```

### 6.将动态获取的权限传递给子组件

```vue
    \<AuthModal :visible="visible" ref="authModal" :checked-keys="checkedKeys" /\>
```

子组件接收

==AuthModal.vue==

```vue
 \<el-dialog :model-value="visible" title="权限设置" width="600px" @open="handleOpen"  @close="handleClose"\>
```

```ts
const treeRef = ref()
const handleCheckChange = () =\> {
    console.log('checked keys:', treeRef.value.getCheckedKeys());
  
};

const handleOpen = () =\> { 
    console.log(555,props.checkedKeys)
    treeRef.value.setCheckedKeys(props.checkedKeys)
}

const handleClose = () =\> {
    emit("close")
}
```

### 7.按钮级权限

==System.vue==

```vue
   \<AuthModal :visible="visible" :checked-keys="checkedKeys"   @close="visible = false"  :btnAuth="btnAuth"/\>
```



```ts
const btnAuth=ref\<string[]\>([])
const settingAuth = async (pageAuthority:string) =\> {
    const { data: { list, btn } } = await getAuthApi(pageAuthority);
    checkedKeys.value = collectUrls(list)
    btnAuth.value=btn
    visible.value = true

}
```

==AuthModal.vue==

```vue
 \<el-card class="mt"\>
            \<template #header\>
                \<div class="card-header"\>
                    \<span\>按钮权限\</span\>
                \</div\>
            \</template\>

            \<el-checkbox-group v-model="initBtnAuth" class="mt"\>
                \<el-checkbox label="全部" value="all" /\>
                \<el-checkbox label="添加" value="add" /\>
                \<el-checkbox label="编辑" value="edit" /\>
                \<el-checkbox label="删除" value="delete" /\>
            \</el-checkbox-group\>
        \</el-card\>
```

```ts
const props = defineProps({
    visible: Boolean,
    checkedKeys: Array,
    btnAuth:Array
})

const handleOpen = () =\> { 
    treeRef.value.setCheckedKeys(props.checkedKeys)
    initBtnAuth.value=props.btnAuth
}
```

### 8.提交数据



==AuthModal.vue==

```ts
import {setAuthApi} from "@/api/system"
import { ElMessage } from 'element-plus'

const emit = defineEmits(['close',"reload"])

const handleConfirm=async ()=\>{
  console.log(88,treeRef.value.getCheckedKeys(),initBtnAuth.value)  
  const res=await setAuthApi(treeRef.value.getCheckedKeys(),initBtnAuth.value);
  if (res.code == 200) {
    ElMessage({
        message: res.message,
        type: 'success',
    });
   }
    
  emit("close") //关闭弹窗
  emit("reload")
}
```

父组件

```vue
 \<AuthModal :visible="visible" :checked-keys="checkedKeys"   @close="visible = false"  :btnAuth="btnAuth" @reload="loadData"/\>
```

### 9.传参的时候应该补充上账号名称

==System.vue==

```vue
\<el-button type="primary" size="small"   @click="settingAuth(scope.row.pageAuthority,scope.row.account)"\>
                        权限设置
\</el-button\>

 \<AuthModal :visible="visible" :checked-keys="checkedKeys"   @close="visible = false"  :btnAuth="btnAuth" @reload="loadData" :account="accoutNo"/\>
```

```ts
const settingAuth = async (pageAuthority:string,accout:string) =\> {
    accoutNo.value=accout
    const { data: { list, btn } } = await getAuthApi(pageAuthority);
    checkedKeys.value = collectUrls(list)
    btnAuth.value=btn
    visible.value = true

}
```



==AuthModal.vue==

```ts
const props = defineProps({
    account:{
        type:String,
        required:true
    },
    visible: Boolean,
    checkedKeys: Array,
    btnAuth:{
        type:Array,
        required:true
    }
})

const handleConfirm=async ()=\>{
  console.log(88,treeRef.value.getCheckedKeys(),initBtnAuth.value)  
  const res=await setAuthApi(props.account,treeRef.value.getCheckedKeys(),initBtnAuth.value);
  if (res.code == 200) {
    ElMessage({
        message: res.message,
        type: 'success',
    });
   }
    
  emit("close") //关闭弹窗
  emit("reload")
}
```

==api-system.ts==

```ts
import { post } from "../utils/http"
enum Api {
    auth = '/userAuth', 
    setAuth='setAuth'
}

function getAuthApi(pageAuthority:string):Promise\<any\> {
    return post(Api.auth, {pageAuthority})
}
function setAuthApi(account:string,btnList:string[],pageList:string[]):Promise\<any\>{
    return post(Api.setAuth,{account,btnList,pageList})
}

export {getAuthApi,setAuthApi}
```



# 27.个人中心页面开发

静态部分及分步表单不做详细介绍

## 1.按钮级权限控制

自定义指令的语法

```ts
app.directive('指令名', 配置项);
```

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {}
}
```

配置项内容比较多，我们定义单独的文件存储

==directives-permission.ts==

```ts
import { useUserStore } from "@/store/auth"
export  default{
    beforeMount(el:any,binding:any){
        const userStore=useUserStore();
        const {roles}=userStore;
        const requirePermission=binding.value;
        if(!roles.includes(requirePermission)){
            el.style.display="none"
        }
    }
}
```

我们需要拿到当前用户的角色和该按钮所需要的角色对比，判断当前用户拥有的角色中是否包含该按钮所需的角色，如果不包含，说明权限不够，则按钮隐藏

\> 使用

```vue
  \<el-button type="primary" size="small" class="mr" v-permission="'user'"\>去处理\</el-button\>
```

# 28.环境变量的设置

## 1.添加环境变量文件

在你的项目根目录下，你可以创建不同的环境变量文件。Vite 支持以下类型的文件：

- `.env`：用于所有环境
- `.env.local`：用于本地开发（忽略版本控制）
- `.env.development`：用于开发环境
- `.env.production`：用于生产环境

## 2.定义环境变量

环境变量名必须以 `VITE_` 前缀开头，Vite 只会加载以此前缀开头的环境变量

如：

```js
VITE_API_URL=https://www.demo.com
```

## 3.访问环境变量

- 可以在代码中直接使用 `import.meta.env` 访问这些变量。

```js
console.log(import.meta.env.VITE_API_URL);
```

## 4.获取不同环境变量的原理

Vite 默认有几个模式，你可以在运行命令时指定不同的模式：

- **开发模式**（默认模式）: 使用 `vite` 或 `npm run dev` 启动开发服务器。它会使用 `.env.development` 和 `.env` 文件。

- **生产模式**: 使用 `vite build` 或 `npm run build` 进行生产构建。它会使用 `.env.production` 和 `.env` 文件。

- **自定义模式**: 你可以通过 Vite 的 `--mode` 参数指定其他模式。例如，如果你想在测试环境下运行：

  ```
  vite --mode testCopy
  ```

  这样 Vite 会加载 `.env.test` 和 `.env` 文件。

## 5.修改项目中的接口地址

==utils-axios.ts==

```js
const service: AxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    timeout: 5000 // 请求超时时间
});
```



# 29.打包上线

## 1.打包

1.运行npm run build

解决打包报错:

![image-20241104142504503](http://114.67.74.14/static/vue_project_assetsimage-20241104142504503.png)

```ts
npm install --save-dev @types/file-saver
```



打包后生成了dist文件夹，即我们的项目文件

## 2.部署上线
