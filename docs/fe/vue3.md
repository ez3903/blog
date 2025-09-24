# 1.什么是Vue

![image-20240126160543856](/vue3/image-20240126160543856.png)

## 1.1 什么是渐进式框架

简单来说我们只用它的核心，完全就可以做项目，但是他官方又提供了很多的工具等，可以根据自己的需求来选择使用

好比套餐和单买的区别，比如我买一个火锅套餐，渐进式框架就是我先点个锅底，别的我想吃啥再点啥，非渐进式就是直接给你一个套餐，你爱不爱吃就全给你上了

## 1.2 为什么要使用vue

1. **数据驱动**: Vue.js 使用响应式数据绑定和组件系统，允许你通过改变应用的状态来自动更新UI界面，而不是手动操作DOM元素。
2. **组件化**: Vue.js 鼓励将界面拆分为可重用的组件，这使得代码组织和管理变得更容易。
3. **虚拟DOM**: Vue.js利用虚拟DOM技术来最小化与实际DOM的交互，提高渲染性能。

## 1.3 关于vue的版本

Vue 2 已于 **2023 年 12 月 31 日**停止维护

## 1.4 vue3全家桶 

vue-router (4.x)

Pinia

Vite (5.x)

Element plus

## 1.5 Vue3有什么优势

- 性能提升，运行速度是vue2.x的1.5倍左右
- 体积更小，按需编译体积比vue2.x要更小
- 类型推断，更好的支持Ts（typescript）
- 高级给予，暴露了更底层的API和提供更先进的内置组件
- 组合API (composition api) ，能够更好的组织逻辑，封装逻辑，复用逻辑



## 1.6 Vue3的使用建议

- 新版本的路由(v 4.x)、开发工具和测试工具，支持 Vue 3     
- 构建工具链：Vue CLI -\> [Vite](https://vitejs.dev/)
- 状态管理：Vuex -\> [Pinia](https://pinia.vuejs.org/)
- IDE 支持：Vetur -\> [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
- 新的命令行 TypeScript 支持：[vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc)



# 2.开始使用(引入文件的方式)

```htm
\<script src="https://unpkg.com/vue@3/dist/vue.global.js"\>\</script\>
```

每个 Vue 应用都是通过 **createApp** 函数创建一个新的 应用实例

\> **createApp：**
\>
\> 创建一个应用实例。
\>
\> 第一个参数是根组件。第二个参数可选，它是要传递给根组件的 props。

## 2.1 基本用法:

```html
\<div id="app"\>\</div\>
\<script\>
    const { createApp } = Vue
    const App={
        template:`\<h1\>{{msg}}\</h1\>`,
        data(){
            return {
                msg:"hello vue3!"
            }
        }
    }
    createApp(App).mount('#app')
\</script\>
```

template可以不提供：

当根组件没有设置 template 选项时，Vue 将自动使用容器的 innerHTML 作为模板。

```html
\<div id="app"\>
    {{msg}}
\</div\>
\<script\>
    const { createApp } = Vue
    const App={
        data(){
            return {
                msg:"hello vue3!"
            }
        }
    }
    createApp(App).mount('#app')
\</script\>
```



当然，一个项目中也可以同时拥有多个vue实例

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```





## 2.2 模版语法

最基本的数据绑定形式是文本插值，它使用的是“Mustache”语法 (即双大括号)

```vue
\<span\>Message: {{ msg }}\</span\>
```

但是这样写有问题，就是无法识别html标签,如下

```vue
    \<div id="app"\>{{ msg }}\</div\>
    \<script\>
        const { createApp, ref } = Vue
        createApp({
            data() {
                return {
                    msg: "\<h1\>hahaha\</h1\>"
                }
            }
        }).mount('#app')
    \</script\>
```

![image-20240126162518996](/vue3/image-20240126162518996.png)

这个时候就需要指令：



# 3.指令

\> 指令由 `v-` 作为前缀，表明它们是一些由 Vue 提供的特殊 attribute

## 3.1 v-html

```vue
    \<div id="app" \>
        \<div v-html="msg"\>\</div\> \<!--注意不要直接给容器元素加指令，因为挂载操作会替换掉里面的所有内容，包括你尝试插入的任何东西--\>
    \</div\>
    \<script\>
        const { createApp, ref } = Vue
        createApp({
            data() {
                return {
                    msg: "\<h1\>hahaha\</h1\>"
                }
            }
        }).mount('#app')
    \</script\>
```

## 3.2 v-text 

等同于双大括号插值

## 3.3 v-bind

### 3.3.1 基本使用

\> 动态的绑定一个或多个 attribute，也可以是组件的 prop。

```vue
    \<div id="app" \>
        \<div v-bind:class="a" v-bind:id="b"\>\</div\>
    \</div\>
    \<script\>
        const { createApp, ref } = Vue
        createApp({
            data() {
                return {
                   a:"title",
                   b:"box"
                }
            }
        }).mount('#app')
    \</script\>
```

关于缩写：

1.v-bind可以省略为：

```
			\<div :id="b"\>\</div\>
```

2.当 attribute 和绑定的值同名时，值可以省略 ==3.4版本新增==

```html
\<div 	:id\>\</div\>
或者
\<div v-bind:id\>\</div\>
```

### 3.3.2 同时绑定多个属性

```vue
    \<div id="app" \>
        \<div v-bind="{id:a,class:b}"\>\</div\>
      	\<!--
						缩写形式
					 \<div :="{id:a,class:b}"\>\</div\>
				--\>
    \</div\>
    \<script\>
        const { createApp, ref } = Vue
        createApp({
            data() {
                return {
                   a:"title",
                   b:"box"
                }
            }
        }).mount('#app')
    \</script\>
```

### 3.3.3 class的绑定

\> 1.绑定到字符串

\> 2.绑定到对象

```vue
\<div :class="{ active: isActive }"\>\</div\>    
isActive是布尔值
```

\> 3.绑定到数组

```vue
\<div :class="[activeClass, errorClass]"\>\</div\>
 activeClass是字符串名字
```

### 3.3.4 style的绑定

\> 1.绑定到字符串

\> 2.绑定到对象

```vue
\<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"\>\</div\>
```

\> 3.绑定到数组

```vue
\<div :style="[baseStyles, overridingStyles]"\>\</div\>
```



### 3.3.4 动态属性绑定

```vue
\<!-- 动态 attribute 名 --\>
\<button v-bind:[key]="value"\>\</button\>
```



## 3.4 v-on

\> 给元素绑定事件监听器

```vue
\<!-- 方法处理函数 --\>
\<button v-on:click="doThis"\>\</button\>

\<!-- 动态事件 --\>
\<button v-on:[event]="doThis"\>\</button\>

\<!-- 内联声明 --\>
\<button v-on:click="doThat('hello', $event)"\>\</button\>

\<!-- 缩写 --\>
\<button @click="doThis"\>\</button\>

\<!-- 使用缩写的动态事件 --\>
\<button @[event]="doThis"\>\</button\>

\<!-- 停止传播 --\>
\<button @click.stop="doThis"\>\</button\>

\<!-- 阻止默认事件 --\>
\<button @click.prevent="doThis"\>\</button\>

\<!-- 不带表达式地阻止默认事件 --\>
\<form @submit.prevent\>\</form\>

\<!-- 链式调用修饰符 --\>
\<button @click.stop.prevent="doThis"\>\</button\>

\<!-- 按键用于 keyAlias 修饰符--\>
\<input @keyup.enter="onEnter" /\>

\<!-- 点击事件将最多触发一次 --\>
\<button v-on:click.once="doThis"\>\</button\>

\<!-- 对象语法 --\>
\<button v-on="{ mousedown: doThis, mouseup: doThat }"\>\</button\>
```



\> 事件修饰符

- `.stop` - 调用 `event.stopPropagation()`。
- `.prevent` - 调用 `event.preventDefault()`。
- `.capture` - 在捕获模式添加事件监听器。
- `.self` - 只有事件从元素本身发出才触发处理函数。
- `.{keyAlias}` - 只在某些按键下触发处理函数。
- `.once` - 最多触发一次处理函数。
- `.left` - 只在鼠标左键事件触发处理函数。
- `.right` - 只在鼠标右键事件触发处理函数。
- `.middle` - 只在鼠标中键事件触发处理函数。
- `.passive` - 通过 `{ passive: true }` 附加一个 DOM 事件。



\> 事件对象的处理
\>
\> 有时我们需要在内联事件处理器中访问原生 DOM 事件。你可以向该处理器方法传入一个特殊的 `$event` 变量，或者使用内联箭头函数：

\> $event是关键字，不能叫别的名字

```vue
\<!-- 使用特殊的 $event 变量 --\>
\<button @click="warn('Form cannot be submitted yet.', $event)"\>
  Submit
\</button\>

\<!-- 使用内联箭头函数 --\>
\<button @click="(event) =\> warn('Form cannot be submitted yet.', event)"\>
  Submit
\</button\>
```



## 3.5 v-if

\> 基本使用

```vue
\<div v-if="type === 'A'"\>
  A
\</div\>
\<div v-else-if="type === 'B'"\>
  B
\</div\>
\<div v-else-if="type === 'C'"\>
  C
\</div\>
\<div v-else\>
  Not A/B/C
\</div\>
```

\> 也可以在template上使用

```vue
\<template v-if="ok"\>
  \<h1\>Title\</h1\>
  \<p\>Paragraph 1\</p\>
  \<p\>Paragraph 2\</p\>
\</template\>
```

## 3.6 v-show

不同之处在于 `v-show` 会在 DOM 渲染中保留该元素；`v-show` 仅切换了该元素上名为 `display` 的 CSS 属性。

v-show 不支持在 \\<template\\> 元素上使用

## 3.7 v-for

\> 循环对象

```vue
\<li v-for="(value, key, index) in myObject"\>
  {{ index }}. {{ key }}: {{ value }}
\</li\>
```

\> 循环数组

```tsx
\<li v-for="(item, index) in items"\>
  {{ index }} - {{ item.message }}
\</li\>

const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

```

\> 循环整数

```tsx
\<span v-for="n in 10"\>{{ n }}\</span\>
```

\> template上使用v-for

```vue
\<ul\>
  \<template v-for="item in items"\>
    \<li\>{{ item.msg }}\</li\>
    \<li class="divider" role="presentation"\>\</li\>
  \</template\>
\</ul\>
```

⚠️==同时使用 `v-if` 和 `v-for` 是**不推荐的**==

当它们同时存在于一个节点上时，`v-if` 比 `v-for` 的优先级更高。这意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名：

```vue
\<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
--\>
\<li v-for="todo in todos" v-if="!todo.isComplete"\>
  {{ todo.name }}
\</li\>
```

✅推荐做法

```vue
\<template v-for="todo in todos"\>
  \<li v-if="!todo.isComplete"\>
    {{ todo.name }}
  \</li\>
\</template\>
```

==[推荐](https://cn.vuejs.org/style-guide/rules-essential.html#use-keyed-v-for)在任何可行的时候为 `v-for` 提供一个 `key` attribute==

\> 为什么要给key？





\> 关于数组变化的更改

1.直接通过角标更改数组是没问题的

2.使用以下方法更改也是没问题的

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`



注意：以上方法都可以直接修原数组，但是有一些方法不能直接修改原数组，比如filter()`，`concat()` 和 `slice()，这种方法不会触发页面更新

对于这种情况，必须要主动对数组整体进行重新赋值

```js
this.items= this.items.slice(1,3)
```

\> 对于对象的更改可以直接修改属性，添加属性都是没问题的

## 3.8 v-model

```vue
\<input v-model="text"\>
```

**特殊的**

\> 单一的复选框，绑定布尔类型值

```vue
\<input type="checkbox" id="checkbox" v-model="checked" /\>
\<label for="checkbox"\>{{ checked }}\</label\>
```

![image-20240711152645429](/vue3/image-20240711152645429.png)

\> 多个复选框绑定到同一个数组或[集合](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)的值

![image-20240711152719423](/vue3/image-20240711152719423.png)

\> 单选按钮绑定到选中项的值

![image-20240711152941501](/vue3/image-20240711152941501.png)

\> 下拉选择框绑定到选中项option的值

![image-20240716184142791](/vue3/image-20240716184142791.png)

\> 特殊的对于复选框我们可以手动更改选中它时候的值

```vue
\<input type="checkbox" v-model="toggle" true-value="yes" false-value="no" /\>
```

\> true-value 和 false-value 是 Vue 特有的 attributes，仅支持和 v-model 配套使用。这里 toggle 属性的值会在选中时被设为 'yes'，取消选择时设为 'no'。你同样可以通过 v-bind 将其绑定为其他动态值：





### 修饰符：

\> .lazy

默认情况下，v-model 会在每次 input 事件后更新数据 (IME 拼字阶段的状态例外)。你可以添加 lazy 修饰符来改为在每次 change 事件后更新数据：

```vue
\<!-- 在 "change" 事件后同步更新而不是 "input" --\>
\<input v-model.lazy="msg" /\>
```

\> .number

如果你想让用户输入自动转换为数字，你可以在 v-model 后添加 .number 修饰符来管理输入：

```vue
\<input v-model.number="age" /\>如果该值无法被 parseFloat() 处理，那么将返回原始值。
```

number 修饰符会在输入框有 type="number" 时自动启用。

\> .trim

如果你想要默认自动去除用户输入内容中两端的空格，你可以在 v-model 后添加 .trim 修饰符：

```vue
\<input v-model.trim="msg" /\>
```



# 4.计算属性computed

\> 计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算

\> 计算属性的值不要直接改

```js
export default {
  data() {
    return {
      a: "hello",
      b: "world"
    }
  },
  computed:{
    ab(){
      return this.a+this.b
    }
  }
}
```





# 5.侦听器watch

```vue
\<template\>
  \<h1\>{{ a }}\</h1\>
  \<button @click="fn"\>按钮\</button\>
\</template\>
\<script\>
export default {
  data() {
    return {
      a: "hello",
     
    }
  },
  methods:{
    fn(){
      this.a="aaa"
    }
  },
  watch:{
    a(){
      console.log("a变了")
    }
  }
}
\</script\>
```

`watch` 默认是浅层的：被侦听的属性，仅在被赋新值时，才会触发回调函数——而嵌套属性的变化不会触发。如果想侦听所有嵌套的变更，你需要深层侦听器：

```js
export default {
  watch: {
    someObject: {
      handler(newValue, oldValue) {
        // 注意：在嵌套的变更中，
        // 只要没有替换对象本身，
        // 那么这里的 `newValue` 和 `oldValue` 相同
      },
      deep: true
    }
  }
}
```



# 6.组件

## 1.全局注册

```js

const app = createApp(App);

// 全局注册组件
app.component('MyComponent', MyComponent);

app.mount('#app');

```



## 2.局部注册

组件在使用的时候用驼峰式

```html
\<!DOCTYPE html\>
\<html lang="en"\>

\<head\>
    \<meta charset="UTF-8"\>
    \<title\>Document\</title\>
    \<script src="https://unpkg.com/vue@3/dist/vue.global.js"\>\</script\>
\</head\>

\<body\>
    \<div id="app"\>
       \<p\>{{msg}}\</p\>
       \<C hild/\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            template:`\<h1\>{{msg}}\</h1\>`,
            data(){
                return {
                    msg:"我是子组件"
                }
            }
        }
        const App = {
            data() {
                return {
                    msg: "hello vue3!",
                    toggle: false
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
\</body\>

\</html\>
```

## 3.组件之间的传值

\> 父传子通过props

```html
    \<div id="app"\>
       \<p\>{{msg}}\</p\>
       \<child :a="msg"/\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            props:["a"],
            template:`\<h1\>{{msg}}{{a}}\</h1\>`,
            data(){
                return {
                    msg:"我是子组件"
                }
            }
        }
        const App = {
            data() {
                return {
                    msg: "hello vue3!",
                    toggle: false
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
```

\> 子传父通过自定义事件

```html
    \<div id="app"\>
       \<p\>我是父组件{{msg}}\</p\>
       \<child @fn="change"/\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            props:["a"],
            template:`\<h1 @click="handle"\>我是子组件\</h1\>`,
            data(){
                return {
                    msg:"我是子组件的数据"
                }
            },
            methods:{
                handle(){
                    this.$emit("fn",this.msg)
                }
            }
        }
        const App = {
            data() {
                return {
                    msg: "hello vue3!",
                    toggle: false
                }
            },
            methods: {
                change(data){
                    this.msg=data
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
```



## 3.插槽

既然组件可以写成双标签，我们就希望可以在组件内写点东西如

```vue
\<my-child\>hello vue3\</my-child\>
```

但是这种写法肯定不生效，因为my-child组件本身就代表着一大段的html结构，这时候就需要用到插槽

\> 1.插槽的基本使用

```html
    \<div id="app"\>
       \<p\>{{msg}}\</p\>
       \<child\> \<h1\>hello vue3\</h1\>\</child\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            template:`\<h1\>
                 \<slot\>\</slot\>
                我是子组件     
                \</h1\>`,
        }
        const App = {
            data() {
                return {
                    msg: "我是父组件", 
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
```

slot里也可以写内容，这会在组件调用时候如果没有传入具体的内容，那么就会使用slot里的默认内容

```js
        const Child={
            template:`\<h1\>
                 \<slot\>8888\</slot\>
                我是子组件     
                \</h1\>`,
        }
```

\> 2.具名插槽

可以定义多个插槽，将组建标签内的不同内容渲染到不同的位置上

给slot设置name属性，然后在组建标签内设置template包裹我们要渲染的内容，通过设置v-slot:name名字

默认没给名字的插槽，他的名字叫default

```html
    \<div id="app"\>
       \<p\>{{msg}}\</p\>
       \<child\> 
            \<!--v-slot:before可以简写为 #before--\>
            \<template v-slot:before\>
                \<h1 \>hello vue3\</h1\>
            \</template\>
            \<template v-slot:after\>
                \<h1 \>hahahaha\</h1\>
            \</template\>
           
        \</child\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            template:`\<h1\>
                 \<slot name="before"\>\</slot\>
                我是子组件     
                \<slot name="after"\>\</slot\>
                \</h1\>`,
        }
        const App = {
            data() {
                return {
                    msg: "我是父组件", 
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
```

\> 3.条件插槽

有的时候我们通过插槽是否存在来渲染某些内容。

结合使用 [$slots](https://cn.vuejs.org/api/component-instance.html#slots) 属性与 [v-if](https://cn.vuejs.org/guide/essentials/conditional.html#v-if) 来实现

这种方法可以避免渲染空的HTML标签，优化DOM结构，并且让页面更加整洁。使用条件插槽也有助于提升页面的性能，避免处理不必要的渲染计算。

```html
\<!DOCTYPE html\>
\<html lang="en"\>

\<head\>
    \<meta charset="UTF-8"\>
    \<title\>Document\</title\>
    \<script src="https://unpkg.com/vue@3/dist/vue.global.js"\>\</script\>
    \<style\>
        .before{color: red;}
        .after {color: blue;}
    \</style\>
\</head\>

\<body\>
    \<div id="app"\>
       \<p\>{{msg}}\</p\>
       \<child\> 
            \<template v-slot:before\>
                \<h1 \>hello vue3\</h1\>
            \</template\>
            \<template v-slot:after\>
                \<h1 \>hahahaha\</h1\>
            \</template\>
           
        \</child\>
    \</div\>
    \<script\>
        const { createApp } = Vue
        const Child={
            template:`\<h1\>
                \<div v-if="$slots.before" class="before"\>
                     \<slot name="before"\>\</slot\>    
                \</div\>
                
                我是子组件 
                \<div v-if="$slots.after" class="after"\>
                     \<slot name="after"\>\</slot\>    
                \</div\>    
               
                \</h1\>`,
        }
        const App = {
            data() {
                return {
                    msg: "我是父组件", 
                }
            },
            components:{
                Child
            }
        }
        createApp(App).mount('#app')
    \</script\>
\</body\>

\</html\>
```

\> 4.动态插槽

```vue
\<base-layout\>
  \<template v-slot:[dynamicSlotName]\>
    ...
  \</template\>

  \<!-- 缩写为 --\>
  \<template #[dynamicSlotName]\>
    ...
  \</template\>
\</base-layout\>
```

\> 5.作用域插槽

如下图，在插槽中直接访问组件内部的a，是访问不到的，因为这里属于父组件的作用域



![image-20240718142818567](/vue3/image-20240718142818567.png)

所以如果想在插槽中访问组件自己的数据,也要通过类似属性的方式传入

![image-20240718143155049](/vue3/image-20240718143155049.png)

非具名插槽的写法，也需要套一个template，v-slot指令不能直接作用于普通标签

![image-20240718143418835](/vue3/image-20240718143418835.png)





# 7.脚手架创建项目

\> **1.vue-cli**

对于 Vue 3，应该使用 npm 上可用的 Vue CLI v4.5 作为 @vue/cli

要升级，你应该需要全局重新安装最新版本的 @vue/cli：

```bash
npm install -g @vue/cli
# 或
yarn global add @vue/cli
```

\> **2.vite**( vue 官方推荐)
\>
\> 我们现在推荐[Vite](https://vitejs.dev/)作为 Vue 3 项目的新构建工具链。Vite是一个新的构建工具，提供极快的服务器启动和热更新性能。它最初是由 Vue 团队创建的，但现在是一个跨框架工具

Vite 是一个 web 开发构建工具，由于其原生 ES 模块导入方式，可以实现闪电般的冷服务器启动。

![1659070058220](/vue3/1659070058220.png)



**使用:**

```bas
 npm init vue@latest
 //这一指令将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具
```

![image-20230812115642592](/vue3/image-20230812115642592.png)



## 项目文件解读

![image-20230812115746608](/vue3/image-20230812115746608.png)



**Vue3的项目组件中，不需要有一个根节点，但是不加根元素，编辑器默认会有报错，需要做以下设置**

==vue3中的单文件组件是默认导出的==

![1659076801799](/vue3/1659076801799.png)

![1659076865229](/vue3/1659076865229.png)

操作后重启编辑器即可



App.vue文件里的内容我们可能暂时看不懂，我们可以自己新建个App.vue，原来那个暂且命名为App2.vue，之后再讨论

![image-20230812212219560](/vue3/image-20230812212219560.png)



# 8.组合式API(Composition API)

\> Vue 的组件可以按两种不同的风格书写：**选项式 API** 和**组合式 API**。
\>
\> 我们之前所用的方式就是选项式api，在vue3中依旧可以正常使用，但是更推荐使用组合式api



## 1.setup选项

\>  setup是vue3新增的生命周期函数 
\>
\> setup位于beforeCreate之前,用于代替created 和beforeCreate。
\>
\> 由于setup函数执行的时候项目还没有进行初始化，所以不能访问data或methods中的数据
\>
\> console.log(this)显示为undefind。

vue3和vue2不同的地方就是不必写 data、methods、等代码块了，所有的东西都可以在 setup 中返回



\> **1.setup 可以返回两种值：**

1.返回对象： 对象中的属性、方法都可以直接在模板中使用（重点） 

```vue
\<template\>
 	\<h1\>{{msg}}\</h1\>
 	\<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
export default {
  name: 'App',
  setup(){
    let msg="hello"; //但是注意此时的数据其实不是响应式的数据，我们后面会说
    function fn(){
      alert(msg)
    }
    return {
      msg,fn
    }
  }
}
\</script\>
```

2.返回渲染函数：  可以自定义渲染内容（其实也就是 render 函数）注意：渲染函数优先级还高，他会替换掉模板中的其他内容（了解）

```vue
\<template\>
 	\<h1\>{{msg}}\</h1\>
 	\<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
import { h } from 'vue';

export default {
  name: 'App',
  setup(){
    return ()=\>h("h1","我是自定义内容")
  }
}
\</script\>
```



\>  **2.在vue2的配置中可读取到vue3配置中的属性和方法** 

```vue
\<template\>
 \<h1\>{{msg}}\</h1\>
 \<button @click="tips"\>更改\</button\>
\</template\>
\<script\>
export default {
  name: 'App',
  data(){
    return{
      age:18
    }
  },
  methods:{
    tips(){
      console.log(this.msg)//正常读取setup中定义的msg
      this.fn()//正常读取setup中定义的fn
    }
  },
  setup(){
    let msg="hello";
    function fn(){
      alert(msg)
    }
    return {
      msg,fn
    }
  }
}
\</script\>

\<style\>
\</style\>

```

\>  **3.在vue3的配置中不能读取vue2配置中的属性和方法** 

```vue
\<template\>
 \<h1\>{{msg}}\</h1\>
 \<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
export default {
  name: 'App',
  data(){
    return{
      age:18
    }
  }，
  setup(){
    let msg="hello";
    function fn(){
     	console.log(this.age) //undefined 读取不到age
    }
    return {
      msg,fn
    }
  }
}
\</script\>
```



\> 4.setup的参数： 第一个参数props

想一下，我们一般在组件中读取父组件传过来的数据都是使用this.属性名来读取props，但是在setup函数中访问不到this，是不是就意味着拿不到属性。所以我们可以通过setup的第一个参数来获取属性

**props：值为对象，包含：组件外部传递过来，且组件内部声明接收了的属性**

```vue
  props: {
    msg: String
  },
  setup(props){
    console.log(2,props)
  }
```

案例：

==App.vue==

```vue
\<template\>
    \<h1\>{{ msg }}\</h1\>
    \<child title="666666"\>\</child\>
\</template\>
\<script\>
import Child from "./Child.vue"
export default {
    setup() {
        let msg = "hello";
        function fn() {
            alert(msg)
        }
        return {
            msg, fn
        }
    },
    components:{
        Child
    }
}
\</script\>
```

==Child.vue==

```vue
\<template\>
    \<div\>
        我是子组件
    \</div\>
\</template\>

\<script\>
export default {
    props:["title"],
    setup (props) {//注意
        console.log("子组件",props.title)//666666
        return {}
    }
}
\</script\>
```

==请注意如果你解构了 props 对象，解构出的变量将会丢失响应性。因此我们推荐通过 props.xxx 的形式来使用其中的 props。==

==如果你确实需要解构 props 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，那么你可以使用 toRefs() 和 toRef() 这两个工具函数：==



\> 第二个参数 context   主要包含attr  slots emit

该上下文对象是非响应式的，可以安全地解构：

```vue
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```



- attrs：
  - 该属性是props中没有声明接收的所有的对象。
    如果你使用props去获取值，同时props中你声明了你要获取的值则：获取的值是undefined

```js
  // props: {
  //   msg: String
  // },
  setup(props,context){
    console.log(2,context.attrs.msg)//Welcome to Your Vue.js App
  }
```



- slots

```vue
\<!--App.vue--\>
\<template\>
  \<img alt="Vue logo" src="./assets/logo.png"\>
  \<HelloWorld msg="Welcome to Your Vue.js App"\>
    \<template v-slot:before\>
      \<h1 \>before\</h1\>
    \</template\>
    \<template v-slot:after\>
      \<h1 \>after\</h1\>
    \</template\>
  \</HelloWorld\>
\</template\>
\<!--HelloWorld.vue--\>

\<template\>
    \<div\>
        \<slot name="before"\>\</slot\>
        我是子组件
        \<slot name="after"\>\</slot\>
    \</div\>
\</template\>
\<script\>
  setup(props,context){
     console.log(99,context.slots.before())//返回元素对象
  }
\</script\>
```



- emit

```js
  setup(props,context){
    function change(){
      context.emit("myfn")
    }
    return{
      change
    }
  }

//HelloWorld.vue
\<HelloWorld msg="Welcome to Your Vue.js App" @myfn="fn"/\>
```



==attrs 和 slots 都是有状态的对象，它们总是会随着组件自身的更新而更新。这意味着你应当避免解构它们，并始终通过 attrs.x 或 slots.x 的形式使用其中的属性。此外还需注意，和 props 不同，attrs 和 slots 的属性都不是响应式的。==





## 2.ref

下面的案例中，我们想修改age，页面是不会有变化的，因为age此时并不是一个响应式数据

```vue
\<template\>
 	\<h1\>{{age}}\</h1\>
 	\<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
export default {
  name: 'App',
  setup(){
    let age=20;
    function fn(){
      age=30; //点击时，页面无变化。实际上数据已经改了，只是页面没有更新。
      //console.log(age) 结果是30说明数据已经被改了  
    }
    return {
      age,fn
    }
  }
}
\</script\>
```

那么如何把一个非响应式数据设置成响应式数据呢？

\> 使用 ref 对 age 进行包装
\>
\> 修改时使用 变量名.value 的语法

\> ### ref():
\>
\> 接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。

```vue
\<template\>
     \<h1\>{{age}}\</h1\> \<!--在模板中使用 ref 时，我们不需要附加 .value，ref 会自动解包-\>
     \<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
import { ref } from 'vue';
export default {
  name: 'App',
  setup(){
    let age=ref(20);//经过ref包裹后返回值是一个对象
    function fn(){
      console.log(age)
      //{__v_isShallow: false, dep: Set(1), __v_isRef: true, _rawValue: 20, _value: 20}
      age.value=30; //// 在 JavaScript 中需要 .value
    }
    return {
      age,fn
    }
  }
}
\</script\>

```

==Tips:==

在Vue 3中，ref函数的返回值确实是一个包装对象，该包装对象具有以下属性：

- __v_isRef：一个布尔值，用于标识此对象是Vue的ref对象。
- _value：存储ref的实际值的属性。
- dep：一个Set实例，用于追踪订阅此ref的依赖项。
- __v_isShallow：一个布尔值，用于标识是否使用浅层代理。
- _rawValue：用于存储未包装的原始值（非响应式的）。

这些额外的属性是Vue内部用于实现ref对象的响应式功能以及追踪依赖项的。在控制台打印ref对象时，会显示这些属性，以更好地了解ref的内部实现细节。然而，用户在使用ref时，可以将其视为一个简单的对象，只需通过`.value`访问和修改其值。







\> 对于引用数据类型来说，用ref来包裹是否可以呢？经过验证也是可以的
\>
\> 如果将一个对象赋值给 ref，那么这个对象将通过 [reactive()](https://cn.vuejs.org/api/reactivity-core.html#reactive) 转为具有深层次响应式的对象。

```vue
\<template\>
 \<h1\>{{person.name}}\</h1\>
 \<h1\>{{person.age}}\</h1\>
 \<button @click="fn"\>更改\</button\>
\</template\>
\<script\>
import { ref } from 'vue';
export default {
  name: 'App',
  setup(){
    let person=ref({name:"小明",age:18});
    function fn(){
      console.log(person.value); //Proxy{name: '小明',age: 18}
      person.value.name="小红";
    }
    return {
      person,fn
    }
  }
}
\</script\>
```



\> **Ref 会使它的值具有深层响应性**
\>
\> 即使改变嵌套对象或数组时，变化也会被检测到

==App.vue==

```vue
\<template\>
    \<h1\>{{obj}}\</h1\> 
    \<button @click="changeName"\>更改\</button\>
\</template\>
\<script\>
import { ref } from 'vue';
export default {

 setup(){

   let obj=ref({name:"小明",age:18,like:["吃饭","睡觉"]});
   function changeName(){
      obj.value.name="小红"
      obj.value.like[0]="打游戏"
    
   }
   return {
    obj,changeName
   }
 }
}
\</script\>
```



\> **ref函数总结**

- 接收的数据可以是基本类型，也可以是对象类型。
- 对象类型的数据：内部“求助”了Vue3.0的一个新函数---**reactive函数。**







## 3.reactive

\>  reactive参数必须是对象(json/arr)
\>
\>  - 在Vue2中响应式数据是通过defineProperty来实现的.
\>  - 而在Vue3响应式数据是通过ES6的Proxy来实现的
\>  - reactive默认也是深度监听

```vue
\<template\>
 \<h1\>{{person.name}}\</h1\>
 \<h1\>{{like}}\</h1\>
 \<button @click="fn"\>更改\</button\>
 \<button @click="fn2"\>更改爱好\</button\>
\</template\>
\<script\>
import { reactive } from 'vue';
export default {
  name: 'App',
  setup(){
    let person=reactive({name:"小明",age:18});
    let like=reactive(["唱","跳","篮球"]) //对于数组来说也是没问题的
    function fn(){
      console.log(person); //Proxy{name: '小明',age: 18}
      person.name="小红";
    }
    function fn2(){
      like[0]="rap" //可以直接通过角标更改，vue2做不到
    }
    return {
      person,fn,like,fn2
    }
  }
}
\</script\>


```



\> **ref与reactive的对比**

- **从定义数据角度对比：**

​			ref用来定义：基本数据类型
​			reactive用来定义：对象（或数组）类型数据
​			备注：ref也可以定义对象（或数组）类型数据，它内部会自动通过reactive转为代理对象

- **从使用角度对比：**

​		ref定义的数据：操作的数据需要.value，读取数据时模板中直接读取不需要.value
​		reactive定义的数据：操作数据与读取数据：均不需要.value 











reactive能做的ref都能做，ref能做的，reactive有可能做不了，如果你以后都选择使用ref也无可厚非

所以官方更推荐使用ref

\> 推荐使用ref的三个理由

**1.`reactive`有限的值类型**

**2.替换整个对象的时候reactive会丢失响应式**

```vue
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<div\>{{ a }}\</div\>
    \<div\>{{ b }}\</div\>
    \<button @click="changeA"\>changeA\</button\>
    \<button @click="changeB"\>changeB\</button\>
  \</div\>
\</template\>

\<script\>
import { ref,reactive } from 'vue';
import Child from './Child.vue';
export default {
  setup(){
    let a=ref({name:"小明"})
    let b=reactive({name:"小红"})

    function changeA(){
        a.value={name:"小1"}
    }
    function changeB(){
      b={name:"小2"} //这里修改b视图不会更新
    }

    return{
      a,b,changeA,changeB
    }
  }
};
\</script\>
```

\> 为什么ref直接赋值不会丢失响应式，而reactive会丢失?

**ref 和整体赋值**
ref 用于处理基本数据类型，但也可以用来包裹对象，使其成为响应式的。关键点在于，ref 返回的是一个响应式对象，这个对象有一个 .value 属性指向原始数据。当你通过 ref 包裹一个对象，然后更新它的 .value 属性，如 a.value = { name: "小1" }，Vue 能够追踪到 .value 属性的更改。通过这种方式，即使你替换了整个对象，新的对象依然会被 ref 包裹，保持响应式。

**reactive 和整体赋值**
reactive 直接将一个对象转换成响应式对象，而不是像 ref 那样通过 .value 属性。当你通过 reactive 创建一个响应式对象，如果直接更换对象引用，如 b = { name: "小2" }（不是修改 b 的属性，而是更换了整个对象），Vue 将无法追踪这种“替换”操作。因为 reactive 返回的是对原始对象的响应式代理，而替换对象的操作其实是把原来的响应式代理丢弃了，新的对象没有进行 reactive 处理，因此新对象不是响应式的。

==简单来说reactive是将对象变成了一个响应式对象，ref是将数据包裹在了一个响应式对象中==

**3.对解构操作不友好**

其实使用ref解构的时候也会丢失响应式

Vue 官方推荐使用 ref 处理解构问题时，并不是说 ref 在所有场合下都能保持响应性，而是其在特定场合（如处理基本类型数据或作为组件间数据传递的媒介）时更简单或直接。但对于对象类型，解构后依旧会导致响应性丢失。

```vue
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<div\>{{ a }}\</div\>
    \<div\>{{ b }}\</div\>
    \<button @click="changeA"\>changeA\</button\>
    \<button @click="changeB"\>changeB\</button\>
  \</div\>
\</template\>

\<script\>
import { ref, reactive } from 'vue';
import Child from './Child.vue';
export default {
  setup() {
    let a = ref({ name: "小明" })
    let b = reactive({ name: "小红" })

    function changeA() {
      let { name } = a.value
      name = "小强"
    }
    function changeB() {
      let { name } = b //更改后页面不会更新
      name = "小刚"
    }

    return {
      a, b, changeA, changeB
    }
  }
};
\</script\>
```



## 4.关于ref自动解包的场景

\> 一个 ref 会在作为响应式对象的属性被访问或修改时自动解包

```vue
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<div\>{{ state }}\</div\>
    \<button @click="fn"\>changeA\</button\>
  \</div\>
\</template\>

\<script\>
import { ref, reactive } from 'vue';
export default {
  setup() {
    const state = reactive({
      count: ref(0)
    });
    function fn(){
      state.count++ //可以生效
    }
    return {
      state,fn
    }
  }
};
\</script\>
```

==只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为[浅层响应式对象](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)的属性被访问时不会解包。==

```javascript
const object = { id: ref(1) } //这种情况不是响应式对象，不会自动解包，所以模板中需要object.id.value访问
```



## 5.shallowRef()

\> shallowRef 是一个用于创建一个简单的 ref 对象的函数，它可以管理一个基本数据类型的响应式状态。与 ref 函数不同的是，shallowRef 不会对属性进行深度观察。这意味着，当 shallowRef 用于对象或数组时，它只会观察对象或数组本身的变化，而不会观察其内部属性或元素的变化。

```js
import { shallowRef } from 'vue';
export default {
  setup() {
    let test = shallowRef( { a: "a", });
    function change() {
    //  test.value.a = "b"; //这里更改不会导致页面变化
     test.value={a:"b"} //这样才会触发更改
    } 
    return{
      test,change
    }
  }
}
```



## 6.shallowReactive()

我们知道,用reactive包裹数据，如果修改对象中的对象信息也是能更新视图的，因为默认是深度监听，如下

```vue
\<template\>
  \<h1\>{{name}} {{age}} {{hobby}}\</h1\>
  \<button @click="name='小红'"\>改名字\</button\>
  \<button @click="hobby.player='james'"\>改爱好\</button\>
\</template\>
\<script\>
import {reactive, toRefs} from "vue"
export default {
  name: "App",
  setup() {  
    let person=reactive({
      name:"小明",
      age:18,
      hobby:{
        type:"sport",
        player:"kobe"
      }
    })
    return{
      ...toRefs(person)
    }
  },
};
\</script\>
```

那这样又有一个问题，在我们的程序中当数据过于复杂并且我们没有这种递归监听的需求时，这样的操作是很消耗性能的

所以VUE还给我们提供的非递归监听的API：

\> **shallowReactive,只监听第一层数据的变化**

```vue
\<template\>
  \<h1\>{{name}} {{age}} {{hobby}}\</h1\>
  \<button @click="name='小红'"\>改名字\</button\>
  \<button @click="hobby.player='james'"\>改爱好\</button\>
\</template\>
\<script\>

import {shallowReactive,toRefs} from "vue"
export default {
  name: "App",
  setup() {  
    let person=shallowReactive({
      name:"小明",
      age:18,
      hobby:{
        type:"sport",
        player:"kobe" //此时修改player视图不会更新，因为目前只监听第一层数据变化
      }
    })
    return{
      ...toRefs(person)
    }
  },
};
\</script\>
```



## 8.triggerRef

强制触发依赖于一个[浅层 ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 的副作用，这通常在对浅引用的内部值进行深度变更后使用

\> 我们知道只有当value发生改变时shallowRef声明的变量才会在视图上进行更新
\>
\> 而triggerRef的作用则是手动执行与 shallowRef 关联的任何副作用，强制更新视图。

==谁还没点特殊情况呀，减肥说我不吃我不吃，今天菜不错，我破例吃一顿吧==

```vue
\<template\>
  \<div\>{{ state }}\</div\>
  \<button @click="shallowRefChange"\>改变\</button\>
\</template\>

\<script\>
import { shallowRef,triggerRef } from 'vue'
export default {
  name: 'App',
  setup() {
    const state = shallowRef({
      count:1
    })
    function shallowRefChange() {
      state.value.count = 100
      triggerRef(state)//强制更新，不加这句话肯定不更新
    }
    return {
      state,
      shallowRefChange,
    }
  },
}
\</script\>

```



## 7.readonly 和shallowReadonly() 

\> **readonly** 是将通过ref 或reactive定义好的数据进行拷贝后变为仅可读的数据，不可进行修改，即无响应
\>
\> 接受一个对象 (不论是响应式还是普通的) 或是一个 ref，返回一个原值的只读代理



```js
 let obj= readonly({name:"小明",age:18})
 obj.name="小红" //不能改
 console.log(obj)
```


```vue
\<template\>
  \<div\>{{ original }} {{copy}}\</div\>
  \<button @click="original.count++"\>改变1\</button\>
  \<button @click="copy.count++"\>改变2\</button\>
\</template\>

\<script\>
import {reactive,readonly } from 'vue'
export default {
  name: 'App',
  setup() {
   const original = reactive({ count: 0 })//可以更改
   const copy = readonly(original)//不能改
    return {
      original,
      copy,
    }
  },
}
\</script\>

```

\> 只读代理是深层的：对任何嵌套属性的访问都将是只读的。

```vue
\<template\>
  \<div\>{{ original }} {{ copy }}\</div\>
  \<button @click="original.a.b++"\>改变1\</button\>
  \<button @click="copy.a.b++"\>改变2\</button\>
\</template\>

\<script\>
import { reactive, readonly } from "vue";
export default {
  name: "App",
  setup() {
    const original = reactive({
      count: 0,
      a: {
        b: 10,
      },
    }); //可以更改
    const copy = readonly(original); //不能改
    return {
      original,
      copy,
    };
  },
};
\</script\>

```

\> shallowReadonly:和 `readonly()` 不同，这里没有深层级的转换：只有根层级的属性变为了只读

```vue
\<template\>
  \<div\>{{ original }} {{ copy }}\</div\>
  \<button @click="original.a.b++"\>改变1\</button\>
  \<button @click="copy.a.b++"\>改变2\</button\>
  \<!-- \<button @click="copy.count++"\>改变2\</button\> 不行  --\>
\</template\>

\<script\>
import { reactive, shallowReadonly } from "vue";
export default {
  name: "App",
  setup() {
    const original = reactive({
      count: 0,
      a: {
        b: 10,
      },
    }); //可以更改
    const copy = shallowReadonly(original); //修改b可以，修改count不可以
    return {
      original,
      copy,
    };
  },
};
\</script\>

```





## 8.响应式API:工具函数

### 1.isRef()

\> **isRef** 检查一个对象是否为 `ref` 包装过的对象

```js
 let a=ref(0)
 let b= reactive({
   name:"xm"
 })
 let c=100;
 console.log(isRef(a),isRef(b),isRef(c))//true false false
```

==使用场景举例==

在使用 Composition API 编写逻辑时，可能会在函数中接收一个参数，并需要判断该参数是否为 ref。通过使用 isRef，可以验证参数类型，并根据需要进行处理。例如：

```js
import { ref, isRef } from 'vue'

function increment(value) {
  if (isRef(value)) {
    value.value++
  } else {
    value++
  }
}

const count = ref(0)
let number = 1

increment(count) // count.value 现在为 1

increment(number) // number 现在为 2
```



### 2.unref()

\> **unref**  如果参数是一个 ref 则返回它的 value，否则返回参数本身。
\>
\> unref()：是 val = isRef(val) ? val.value : val 的语法糖。

```js
let a=ref(0)
let b= reactive({
  name:"xm"
})
let c=100;
console.log(unref(a))//0
```



### 3.toRef和toRefs

\> **toRef 和 toRefs**

之前我们取出对象的属性可能会比较麻烦，所以很多人可能觉得，直接将对象的属性值取出来赋给一个新的属性名

不就可以了，如下

```vue
\<template\>
    \<h1 @click="changeName"\>{{name}} {{age}}  {{person.name}} \</h1\>
\</template\>

\<script\>
import { reactive } from 'vue'

export default {
  name: 'HelloWorld',
  setup(){
    let person=reactive({
          name:"张三",
          age:18
        })
    
    function changeName(){
      person.name="李四"
    }
     
    return{
      name:person.name,//这里不是响应式的
      age:person.age,
      changeName,
      person //person是响应式的
    }
  }
}
\</script\>

\<style scoped\>

\</style\>

```

\> 但是上面这种情况当我们去修改person.name的时候会发现页面没有变化
\>
\> 为什么没有变化，因为我们return的数据已经是一份新数据了，并不是原来那份数据了



\> **toRef**:处理单个属性

语法：

```js
toRef(操作对象, 对象属性)
```

```vue
\<template\>
    \<h1 @click="changeName"\>{{names}} {{age}}  {{person.name}} \</h1\>
\</template\>
\<script\>
import { reactive,toRef } from 'vue'

export default {
  name: 'HelloWorld',
  setup(){
    let person=reactive({
          name:"张三",
          age:18
        })
   const names=toRef(person,"name")//这里的names就等同于person里的name
   
   function changeName(){
      person.name="李四"
    }
     
    return{
      names,
      age:person.age,
      changeName,
      person
    }
  }
}
\</script\>

\<style scoped\>

\</style\>

```

可能有人觉得是，那我直接把person.name的值用ref包裹不也可以实现响应式吗，如下

![1660979306682](/vue3/1660979306682.png)

但是此时 names就是一份新的响应式数据，修改person并不会引起names的更新



\> **toRefs**:处理整个对象
\>
\> 1.toRefs 函数将每个属性包装为 Ref 对象，并返回一个新的对象，该对象具有与原始对象相同的属性结构，但每个属性的值都是 Ref 对象
\>
\> 2.toRefs其实就是将对象中的每一个属性都使用ref处理

toRefs的类型：

```ts
function toRefs\<T extends object\>(
  object: T
): {
  [K in keyof T]: ToRef\<T[K]\>
}

type ToRef = T extends Ref ? T : Ref\<T\>
```





```vue
\<template\>
  \<h1 @click="changeName"\>{{obj}} {{age}}  {{person.name}} \</h1\>
\</template\>

\<script\>
import { reactive,toRefs } from 'vue'
export default {
setup(){
  let person=reactive({
        name:"张三",
        age:18
      })
  
  function changeName(){
    person.name="李四"
    person.age=20
  }
   let obj=toRefs(person) 
  return{
    obj,
    age:person.age,//不是响应式的
    changeName,
    person //person是响应式的
  }
}
}
\</script\>
```

或者如下写法也可以：

```vue
\<template\>
    \<h1 @click="changeName"\>{{name}} {{age}} \</h1\>
\</template\>

\<script\>
import { reactive,toRefs} from 'vue'

export default {
  name: 'HelloWorld',
  setup(){
    let person=reactive({
          name:"张三",
          age:18
        })
   function changeName(){
      person.name="李四"
    } 
    return{
        // 如果直接 ...person 这样的数据不是响应式
    ...toRefs(person),changeName
    }
  }
}
\</script\>
```

关于为什么直接解构之后数据就不是响应式的了，下面的案例可以解释

```js
 let obj={name:"小红",age:18}
 let {name}=obj;
 //console.log("修改之前",name,obj)//修改之前 小红 {name: '小红', age: 18}
 obj.name="小强"
 console.log("修改之后",name,obj)//修改之后 小红 {name: '小强', age: 18}
```



### 4.toValue()

\> 将值、refs 或 getters 规范化为值。这与 unref() 类似，不同的是此函数也会规范化 getter 函数。
\>
\> 如果参数是一个 getter，它将会被调用并且返回它的返回值。
\>
\> ("getters" 通常是指计算属性 (computed properties))

```js
let num = toRef(1)
function changeName() {
  console.log(num) //RefImpl {__v_isShallow: false, dep: undefined, __v_isRef: true, _rawValue: 1, _value: 1}
  console.log(toValue(num)) // 1
  console.log(toValue(() =\> 1)) // 1
}
```



### 5.isProxy

\> 检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。

```js
import { reactive, readonly, isProxy } from 'vue';
const obj = reactive({ name: 'John', age: 25 });
const proxy = readonly(obj);
const a=ref(1)
console.log(isProxy(obj)); // true
console.log(isProxy(proxy)); // true
console.log(isProxy({})); // false
console.log(isProxy([])); // false
console.log(isProxy(a));//false  ref不是基于proxy的
```

### 6.isReactive()

\> 检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理。

```js
const obj = reactive({ name: 'John', age: 25 });
const proxy = readonly(obj);
const a=ref(1)
const b=shallowReactive({a:1,b:2})
console.log(isReactive(obj));//true
console.log(isReactive(proxy));//true
console.log(isReactive(a));//false
console.log(isReactive(b));//true
```



### 7.isReadonly()

\> 检查传入的值是否为只读对象

```js
const obj = reactive({ name: 'John', age: 25 });
const proxy = readonly(obj);
const b=shallowReadonly({a:1,b:2})
console.log(isReadonly(obj));//false
console.log(isReadonly(proxy));//true
console.log(isReadonly(b));//true
```



### 8.toRaw和markRaw

\> **toRaw**
\>
\> 根据一个 Vue 创建的代理返回其原始对象。
\>
\> toRaw() 可以返回由 reactive()、readonly()、shallowReactive() 或者 shallowReadonly() 创建的代理对应的原始对象。

```js
const foo = {}
const reactiveFoo = reactive(foo)

console.log(toRaw(reactiveFoo) === foo) // true
```

\> **markRaw**标记一个对象,使其永远不会再成为响应式对象。

```js
const foo = markRaw({})
console.log(isReactive(reactive(foo))) // false

// 也适用于嵌套在其他响应性对象
const bar = reactive({ foo })
console.log(isReactive(bar.foo)) // false
```

#### markRaw 的使用场景

很多时候，我们会遇见这样的场景。
有一个响应式对象person。
这个响应式对象有很多的属性。
但是呢？个别属性是不需要响应式的。比如爱好

```vue
\<template\>
    \<div\>
        \<p\> 姓名： {{person.name}}\</p\> 
        \<p\> 性别： {{person.sex}}\</p\> 
        \<p\> 爱好： {{person.likes}}\</p\> 
        \<el-button @click="change"\>按钮\</el-button\>
    \</div\>
\</template\>

\<script lang="ts" setup\>
import { reactive,markRaw } from 'vue'
let person:any = reactive({
    name: "杨光",
    sex:'男',
});
 var likes = ['吃饭','睡觉'];
// 往响应式对象中新增一个likes属性，该属性是响应式
// 但是我们使用markRaw包裹后这个likes属性值是不具有响应式的
    person.likes = markRaw(likes);
// 因此试图是不会更新的
var change = () =\> {
    person.likes[0]= '我要吃饭';
    person.likes[1]= '我要睡觉';
    console.log(person.likes);
};
\</script\>

```







## 9.生命周期钩子

\> 因为 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，所以不需要显式地定义它们。
\>
\> 换句话说，在这些钩子中编写的任何代码都应该直接在 `setup` 函数中编写。

除了beforecate和created(它们被setup方法本身所取代)，我们可以在setup方法中访问的API生命周期钩子有9个选项:

**1.onBeforeMount** – 在挂载开始之前被调用：相关的 render 函数首次被调用。

**2.onMounted** – 组件挂载时调用

**3.onBeforeUpdate** – 数据更新时调用，发生在虚拟 DOM 打补丁之前。这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

**4.onUpdated** – 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

**5.onBeforeUnmount** – 在卸载组件实例之前调用。在这个阶段，实例仍然是完全正常的。

**6.onUnmounted** – 卸载组件实例后调用。调用此钩子时，组件实例的所有指令都被解除绑定，所有事件侦听器都被移除，所有子组件实例被卸载。

**7.onActivated** – 被 keep-alive 缓存的组件激活时调用。

**8.onDeactivated** – 被 keep-alive 缓存的组件停用时调用。

**9.onErrorCaptured** – 当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。




![image-20220805224355601](/vue3/image-20220805224355601.png)

**使用：**

在组合API中，我们需要将生命周期钩子导入到项目中，才能使用，这有助于保持项目的轻量性。

```js
setup(){
    onMounted(()=\>{
      console.log("onmounted")
    })
  }
```



\> onUnmounted有什么用？

比如我们在Demo组件中有一个定时器

==Demo.vue==

```vue
\<template\>
    \<div\>
        我是demo组件{{count}}
    \</div\>
\</template\>
\<script\>
import { onUnmounted,ref } from 'vue';
export default {
    setup () {
        let count=ref(0);
        setInterval(()=\>{
            count.value++
            console.log(count.value++)
        },1000)

        onUnmounted(()=\>{
            console.log("组件卸载")
        })
        return {
            count
        }
    }
}
\</script\>

\<style  scoped\>

\</style\>
```

==App.vue==:我们会发现我们将组件卸载了，但是Demo组件的定时器还在运行，这个时候就需要卸载的时候清除定时器

```vue
\<template\>
  \<demo v-if="show"\>\</demo\>
  \<button @click="hide"\>卸载\</button\>
\</template\>

\<script\>
import Demo from "./Demo.vue"
import {ref} from "vue"
export default {
  name: 'App',
  components: {
    Demo
  },
  setup(){
    let show=ref(true);
    function hide(){
      show.value=false
    }
    return{
      show,hide
    }
  } 
}
\</script\>


```

只需要在Demo.vue做如下修改就好了

```js
onUnmounted(()=\>{
            console.log("组件卸载");
            clearInterval(timer)
 })
```



## 10.computed用法

\> 接受一个 getter 函数，返回一个只读的响应式 [ref](https://cn.vuejs.org/api/reactivity-core.html#ref) 对象

==所以在js中访问计算属性也需要加.value==

首先在vue3中继续采用vue2的写法依旧是没问题的,但是我们不推荐

\> Vue2中的计算属性写法

```vue
\<template\>
  \<h1 \>{{c}}\</h1\>
\</template\>
\<script\>
  computed:{
    c(){
      return this.a+this.b
    }
  },
  setup(){
    let a=ref("hello")
    let b=ref("world")
    return{
      a,b
    }
  },
\</script\>
```

\> Vue3中计算属性的写法

```vue
\<template\>
  \<h1 @click="changeA"\>{{c}}\</h1\>
\</template\>
\<script\>
import {ref,computed} from "vue";
export default {
  name: 'App',
  setup(){
    let a=ref("hello")
    let b=ref("world")
    //计算属性
    let c=computed(() =\> a.value+b.value)
	//修改a，c发生变化，说明计算属性生效
    function changeA(){
      a.value="byebye"
    }

    return{
      a,b,c,changeA
    }
  },
 
}
\</script\>
```

\> 默认情况下我们的computed是只读的，也就是不允许更改的
\>
\> 但是我们可以通过配置get set函数使计算属性可更改

```vue
\<template\>
  \<h1 @click="changeA"\>{{c}}\</h1\>
\</template\>
\<script\>
import {ref,computed} from "vue";
export default {
  name: 'App',
  setup(){
    let a=ref("hello")
    let b=ref("world")
    //计算属性
    let c=computed({
      get:()=\>{
        return a.value+b.value
      },
      set:(value)=\>{
       b.value=value
      }
    })
    function changeA(){
      c.value="hehe"
    }

    return{
      a,b,c,changeA
    }
  },
 
}
\</script\>
```







## 11.watch用法

\> **watch可以监听哪些数据？**
\>
\> 1. ref定义的响应式数据 （默认浅层监听）
\> 2. reactive定义的响应式数据 （默认深度监听）
\> 3. 监听一个计算属性 （因为计算属性本质上也是一个ref定义的数据）也是浅层监听



\> 1.使用ref监听基本类型的数据

```js
const index = ref(0);
watch(index,(newValue,oldValue)=\>{
  console.log("新值是"+newValue, "旧址是"+oldValue);
})
```

\> 2.使用ref监听多个基本类型的数据

```js
let index = ref(0);
let num = ref(0)
watch([index,num],(newValue,oldValue)=\>{
  console.log("新值是"+newValue, "旧址是"+oldValue); //返回的是一个数组
})
```

\> 3.使用reactive监听对象 默认是深度监听

```vue
\<template\>
  \<h1 @click="ChangeP"\>{{person.name}}\</h1\>
  \<h1\>{{person.age}}\</h1\>
\</template\>
\<script\>
import {reactive,watch} from "vue";
export default {
  name: 'App',
  setup(){
   const person = reactive({
      name:"张三",
      age:18,
      sex:"男"
    })
    watch(person,(newValue,oldValue)=\>{
      //在嵌套的属性变更时触发
			// 注意：`newValue` 此处和 `oldValue` 是相等的
  		// 因为它们是同一个对象！
      console.log(newValue,oldValue);
    })
    function ChangeP(){
      person.name="李四"
    }
    return{
     person,ChangeP
    }
  },
}
\</script\>
```

\> 4.使用reactive监听对象中的某个属性 默认是浅层监听

```javascript
const person = reactive({
   name:"张三",
   age:18,
   sex:"男"
})
watch(()=\>person.name,(newValue,oldValue)=\>{
  console.log(newValue,oldValue);
})
```

如果想深度监听，也是需要加deep:true



如果想监听对象中的多个属性，写成数组的形式

```js
  watch([()=\>person.name,()=\>person.age],(newValue,oldValue)=\>{
    console.log(newValue,oldValue);
  })

```

\> 5.使用ref监听引用类型的数据,只修改属性不会触发监听，因为默认是浅层监听

```javascript
    let arr=ref({name:"小明"});
    watch(arr,()=\>{
      console.log("触发了")
    })
    function fn(){
      arr.value.name="小红" //不会触发
    }
```

如果整体替换，可以触发

```js
    let arr=ref({name:"小明"});
    watch(arr,()=\>{
      console.log("触发了")
    })
    function fn(){
      arr.value={name:"小强"} //可以触发
    }
```

如果希望修改属性就能触发，需要开启深度监听

```js
    let arr=ref({name:"小明"});
    watch(arr,()=\>{
      console.log("触发了")
    },{
      deep:true //开启深度监听
    }) 
    function fn(){
      arr.value.name="小强" //可以触发
    }
```

有同学可能发现了，不开启深度监听，直接监听 arr.value貌似也可以开启深度监听

```js
    let arr=ref({name:"小明"});
    watch(arr.value,()=\>{
      console.log("触发了")
    })
    function fn(){
      arr.value.name="小强" //可以触发
    }
```

**为什呢呢？**

因为直接检测.value，我们可以打印下.value:

```js
Proxy(Object) {name: '小明'}
```

会发现是个proxy数据，也就是说和reactive一样，因为我们知道使用ref处理引用类型的数据，里面会求助reactive

而reactive默认就是深度监听，所有这个数据就实现了深度监听

==但是这种写法我们并不推荐，我们推荐使用deep:true的方式，显式地声明 `{ deep: true }` 可以提高代码的可读性和维护性。==



\> watch监听计算属性

我们知道，因为computed也是基于ref的所以应该也是浅层监听，但是下面的修改却可以触发watch

```js
    const firstName = ref('John');
    const lastName = ref('Doe');
    
    const fullName = computed(() =\> {
      return {
        first: firstName.value,
        last: lastName.value,
      };
    });

    watch(fullName, (newVal, oldVal) =\> {
      console.log('Watched changes:', newVal,oldVal);
    });

    const fn = () =\> {
      firstName.value = 'Jane';
    };
```

为什么呢？因为计算属性是一个函数，每次重新计算都会重新生成一个对象，所以相当于是整体替换，所以这里修改了属性，引起

计算属性重新计算，返回一个新的对象，触发了watch



\> 6.watch的第三个参数

加上 immediate 参数，就可以让侦听器立即执行操作

```js
watch(num, (newVal, oldVal) =\> {
        console.log("新值：", newVal, "   旧值：", oldVal)
      }, {
        immediate: true
      })
```





## 12.watchEffect

\>  立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。 
\>
\> 默认开启了immediate

**基本用法**

```js
import { ref, watchEffect } from 'vue';

const count = ref(0);
//每次 count.value 改变，watchEffect 会自动运行一次，输出新的 count 值。
watchEffect(() =\> {
  console.log(`count is ${count.value}`);
});
```

\> watch：既要指明监视的属性，也要指明监视的回调。
\>
\> watchEffect：不用指明监视哪个属性，监视的回调中用到哪个属性，那就监视哪个属性。

\> watchEffect有点像computed：
\>
\> - 但computed注重的计算出来的值（回调函数的返回值），所以必须要写返回值。
\> - 而watchEffect更注重的是过程（回调函数的函数体），所以不用写返回值。

```vue
\<template\>
  \<h1 @click="ChangeP"\>{{person.name}} {{person.age}}\</h1\>
\</template\>
\<script\>
import {reactive,watch, watchEffect} from "vue";
export default {
  name: 'App',
  setup(){
  
   const person = reactive({
      name:"张三",
      age:18,
      sex:"男",
      like:{
        type:"篮球",
        player:"kobe"
      }
    })
    watch(person,(newValue,oldValue)=\>{
      console.log(newValue,oldValue);
    },{deep:true})

    watchEffect(()=\>{
        //修改name的时候函数会执行，修改age就不会执行
      console.log("watchEffect",person.name)
    })
    function ChangeP(){
      person.name="james"
    }
    return{
     person,ChangeP
    }
  },
 
}
\</script\>


```

注意watchEffect不能监测对象,如下写法是不会触发的

![1660376718725](/vue3/1660376718725.png)

==watchEffect 基本上是现象级拷贝了 React 的 useEffect==



\> 停止监听

如果你需要手动停止 `watchEffect`，你可以存储它的返回值并调用它。这样可以在组件销毁或特定条件下停止侦听：

```vue
\<template\>
  \<div\>
    {{ count }}
    \<button @click="fn"\>按钮\</button\>
    \<button @click="count++"\>按钮2\</button\>
  \</div\>
\</template\>

\<script\>

import { ref, watchEffect } from 'vue';

export default {
  setup() {
    const count = ref(0);
    const stopWatching = watchEffect(() =\> {
      console.log(`count is ${count.value}`);
    });

    function fn(){
      stopWatching()
    }

    return { count,fn }
  }
}
\</script\>
```

此代码将在 5 秒后停止对 `count.value` 的侦听。

\> 清理副作用

`watchEffect` 的回调函数可以返回一个清理函数，这个函数会在回调函数重新执行之前或侦听器停止监听时执行，用于清理或撤销之前的副作用（如取消定时器或事件监听器）：

```vue
\<template\>
  \<div\>
    {{ count }}
    \<button @click="fn"\>按钮\</button\>
    \<button @click="count++"\>按钮2\</button\>
  \</div\>
\</template\>
\<script\>
import { ref, watchEffect } from 'vue';
export default {
  setup() {
    const count = ref(0);
    const stopWatching = watchEffect((onInvalidate) =\> {
      console.log(`count is ${count.value}`);
      onInvalidate(()=\>{
        console.log(222)
      })
    });
    function fn(){
      stopWatching()
    }

    return { count,fn }
  }
}
\</script\>
```

## 13.vscode设置自动补全ref的value属性

![image-20240821150105631](/vue3/image-20240821150105631.png)



## 14.购物车综合案例实战

```vue
\<template\>
  \<div \>
    \<ul\>
      \<li v-for="(item,index) in products" :key="item.id"\>
        \<input type="checkbox" v-model="item.checked"/\>
        \<span\>{{ item.name }}\</span\>
        \<span\>{{ item.price }}\</span\>
        \<button @click="add(index)"\>+\</button\>
        \<a\>{{ item.count }}\</a\>
        \<button @click="minus(index)"\>-\</button\>
        \<button @click="del(index)"\>delete\</button\>
      \</li\>
    \</ul\>
    \<div\>
       \<input type="checkbox" v-model="isAllSel" @change="handleChange"\>
       \<span\>已选({{ selNum }})\</span\>
       \<span\>总价¥：{{ totalPrice }}\</span\>
       \<button :disabled="!selNum"\>结算\</button\>
    \</div\>
  \</div\>
\</template\>

\<script\>
import {ref,onMounted,computed,watch} from "vue";
export default {
  setup() {
    let products=ref([
      {id:1001,name:"iphone16",price:10000},
      {id:1002,name:"ps5",price:5000},
      {id:1003,name:"外星人电脑",price:20000},
      {id:1004,name:"口红",price:200},
    ])
   
    onMounted(()=\>{
      products.value.forEach(item=\>{
        item.count=1;
        item.checked=false;
      })
      console.log(products.value)
    })
    //点+号
    const add=(index)=\>{
      products.value[index].count++
    }
    //点-号
    const minus=(index)=\>{
      let num= products.value[index].count
      console.log(num)
      if(num\>1){
        //num-- 这里写成num--是绝对不行的
        products.value[index].count--;
      }
    }
    //已选商品数量
   let selNum=computed(()=\>products.value.filter(item=\>item.checked).length)
   //let isAllSel=computed(()=\>selNum.value==products.value.length)

   //定义全选按钮双向绑定的数据
   let isAllSel=ref(false);
  //监听全选按钮，如果打勾就让商品全选，否则就全取消
  //这样不行的原因是如果商品有一个取消勾选，判断不是全选，会把其他商品勾选的全取消
  //  watch(isAllSel,()=\>{
  //    if(isAllSel.value){
  //     products.value.forEach(item=\>item.checked=true)
  //    }else{
  //     products.value.forEach(item=\>item.checked=false)
  //    }
  //  })
    //给全选的input添加一个事件，
    const handleChange=()=\>{
      products.value.forEach(item=\>item.checked=isAllSel.value)
    }

   //监听每一个数据的checked属性
   watch(() =\> products.value.map(product =\> product.checked),()=\>{
      if(selNum.value==products.value.length){
        isAllSel.value=true
      }else{
        isAllSel.value=false
      }
   })

   //总价
   const totalPrice=computed(()=\>{
      let total=0
      products.value.filter(item=\>item.checked).forEach((i)=\>{
        total+=i.count*i.price
      });
      return total
   })
   //删除功能
   const del=(index)=\>{
    products.value.splice(index,1)
   }

  return{
    products,add,minus,selNum,isAllSel,handleChange,totalPrice,del
   }
  },
};
\</script\>
\<style scoped\>
span,button{margin: 0 10px;width: 100px;display: inline-block;}

\</style\>

```





# 9.组合式函数(hooks)

## 1.基本用法 

\> “组合式函数”(Composables) 是一个利用 Vue 组合式 API 来封装和复用**有状态逻辑**的函数。
\>
\> 组合式函数约定用驼峰命名法命名，并以“use”作为开头。

\> **和 React Hooks 的对比**
\>
\> 如果你有 React 的开发经验，你可能注意到组合式函数和自定义 React hooks 非常相似。组合式 API 的一部分灵感正来自于 React hooks，Vue 的组合式函数也的确在逻辑组合能力上与 React hooks 相近。然而，Vue 的组合式函数是基于 Vue 细粒度的响应性系统，这和 React hooks 的执行模型有本质上的不同。这一话题在组合式 API 的常见问题中有更细致的讨论。

目前我们如果想实现一个功能，就需要在setup中定义响应式数据，方法，生命周期，计算属性侦听器等，如下

```vue
\<template\>
  \<h1 @click="changeCount"\>{{count}} {{salary}}\</h1\>
\</template\>
\<script\>
import {computed, onMounted, ref} from "vue"
export default {
  name: 'App',
  setup(){
    let count=ref(0)
    function changeCount(){
      count.value+=100;
    }  
    onMounted(()=\>{
      changeCount();
    })
   let salary=computed(()=\>count.value+"元")
    return{
      count,changeCount,salary
    }
  }  
}
\</script\>
```

但是如果都在setup里面写的话，就会像直接在script标签里写那样，所有逻辑都写在setup里面，很乱，并且没办法复用

所以如果我们想在多个组件中复用这个相同的逻辑呢？我们可以把这个逻辑以一个组合式函数的形式提取到外部文件中：

**单独新建一个count.js**

==count.js==

```js
import {computed, onMounted, ref} from "vue"
// 按照惯例，组合式函数名以“use”开头
function useCount(){
    let count=ref(0)
    function changeCount(){
        count.value+=100;
    }  
    onMounted(()=\>{
        changeCount();
    })
    let salary=computed(()=\>count.value+"元")

    return{count,changeCount,salary}
}

export default useCount

```

==App.vue==

```vue
\<template\>
  \<h1 @click="changeCount"\>{{count}} {{salary}}\</h1\>
\</template\>
\<script\>
import useCount from './count';
export default {
    setup () {
      const {count,changeCount,salary}= useCount();
      return{
        count,changeCount,salary
      }
    }
}
\</script\>
```



## 2.封装公共逻辑

使用hooks首先是可以帮助我们把同一模块的逻辑封装到一起，另一个用途就是可以抽离出公共逻辑方便多个组件复用，

比如我们每个页面可能都需要发送请求然后存储返回的数据

==App.vue==

```vue
\<template\>
  \<div\>{{data}}\</div\>
\</template\>
\<script\>
import axios from "axios";
import { ref } from "vue";
export default {
  setup() {
    let data = ref(null);
    axios({
      method: "get",
      url: "http://localhost:8080/a",
    })
      .then((res) =\> {
        console.log(res)
        data.value = res.data;
      })
      return{
        data
      }
  },
};
\</script\>
```

==mock.js==

```js
import Mock from "mockjs"
Mock.mock("http://localhost:8080/a","get",()=\>{
    return{
        msg:"我是a接口的数据"
    }
})
Mock.mock("http://localhost:8080/b","get",()=\>{
    return{
        msg:"我是b接口的数据"
    }
})
```



上面的逻辑可以单独抽离出一个组合式函数，如下

==Count.js==

```js
import {ref} from "vue"
import axios from "axios";
function useAxios(){
    let data = ref(null);
    axios({
      method: "get",
      url: "http://localhost:8080/a",
    })
      .then((res) =\> {
        console.log(res)
        data.value = res.data;
      })
      return{
        data
      }
}
export default useAxios


```

==App.vue==

```vue
\<template\>
  \<div\>{{data}}\</div\>
\</template\>
\<script\>
import useAxios from "./count"
export default {
  setup() {
   const {data}= useAxios()
   return{
    data
   }
  },
};
\</script\>
```





## 3.带参数的组合式函数

`useFetch()` 接收一个静态的 URL 字符串作为输入，所以它只执行一次请求，然后就完成了。但如果我们想让它在每次 URL 变化时都重新请求呢？那我们可以让它同时允许接收 ref 作为参数：

```js
import axios from "axios";
import { ref, onMounted,isRef, watchEffect,unref } from "vue";
function useAxios(city) {
    let data = ref(null);
    onMounted(() =\> {
        function changeCity() {
            axios({
                method: "get",
                url: "https://restapi.amap.com/v3/weather/weatherInfo",
                params: {
                    key: "580fd476df08d90a38d46b4d6b80537e",
                    city:unref(city)
                }
            }).then(res =\> {
                console.log(res);
                data.value = res //如果数据用reactive定义，这里这样写就会导致不是响应式
            })
        }
        if(isRef(city)){
            watchEffect(changeCity)
        }else{
            changeCity()
        }

    })
    return {
        data
    }
}
export default useAxios
```

这个版本的 useFetch() 现在同时可以接收静态的 URL 字符串和 URL 字符串的 ref。当通过 isRef() 检测到 URL 是一个动态 ref 时，它会使用 watchEffect() 启动一个响应式的 effect。该 effect 会立刻执行一次，并在此过程中将 URL 的 ref 作为依赖进行跟踪。当 URL 的 ref 发生改变时，数据就会被重置，并重新请求。

```vue
//App.vue
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<div\>{{ data }}\</div\>
    \<input type="text" v-model.lazy="city"\>
  \</div\>
\</template\>
\<script\>
import { ref } from 'vue';
import useAxios from "./useAxios.js"
export default {
  setup() {
    let city = ref("北京")
    const { data } = useAxios(city);
    return {
      data, city
    }
  }
};
\</script\>
```



## 4.与Mixins的对比

Vue 2 的用户可能会对 mixins 选项比较熟悉。它也让我们能够把组件逻辑提取到可复用的单元里。

然而 mixins 有三个主要的短板：

**1.不清晰的数据来源**：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 变得不清晰，这使追溯实现和	理解组件行为变得困难。这也是我们推荐在组合式函数中使用 ref + 解构模式的理由：让属性的来源在消费组件	时一目了然。

**2.命名空间冲突：**多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可	以通过在解构变量时对变量进行重命名来避免相同的键名。

**3.隐式的跨 mixin 交流：**多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而	一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。

## 5.和 React Hooks 的对比

如果你有 React 的开发经验，你可能注意到组合式函数和自定义 React hooks 非常相似。组合式 API 的一部分灵感正来自于 React hooks，Vue 的组合式函数也的确在逻辑组合能力上与 React hooks 相近。然而，Vue 的组合式函数是基于 Vue 细粒度的响应性系统，这和 React hooks 的执行模型有本质上的不同。



# 10.customRef

\> customRef 可以用来创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。它需要一个工厂函数，该函数接收 track 和 trigger 函数作为参数，并且应该返回一个带有 get 和 set 的对象。
\>
\> 其实大致意思就是，我们可以按照自己的业务需求去自定义封装一个 ref 对象，在其内部可以使用 get 和 set去跟踪或更新数据，有点计算属性内味了哈~

```vue
\<template\>
    \<h1 @click="changeName"\>{{a}} \</h1\>
    \<input type="text" v-model="a"\>
    \<button @click="changeA"\>改a\</button\>
\</template\>
\<script\>
import {customRef} from 'vue'

export default {
  name: 'HelloWorld',
  setup(){
    function _ref(value){
       return customRef((track,trigger)=\>{
            return{
              get(){
                track()//追踪当前数据的变化
                return value
              },
              set(val){
                value=val;
                trigger()//触发响应,即更新界面
              }
            }
       })
    }
    let a= _ref("hello");

    function changeA(){
      a.value="world"
    }
    return{
      a,changeA
    }
  }
}
\</script\>
```

这样我们基本实现了一个跟ref功能一样的自定义ref，但是如果是一模一样的我们没有必要去自己自定义

比如我们不希望数据更新那么频繁，比如防抖

```vue
\<template\>
    \<h1 @click="changeName"\>{{count}} \</h1\>
    \<button @click="changeCount"\>添加商品数量\</button\>
\</template\>

\<script\>
import {customRef} from 'vue'
export default {
  name: 'HelloWorld',
  setup(){
    function _ref(value){
       let timeout
       return customRef((track,trigger)=\>{
            return{
              get(){
                track()//追踪当前数据的变化
                return value
              },
              set(val){
                clearTimeout(timeout)
                timeout=setTimeout(()=\>{
                  value=val;
                  trigger()//触发响应,即更新界面
                },1000)
              }
            }
       })
    }
    let count= _ref(0);
    function changeCount(){
      count.value++
    }
    return{
      count,changeCount
    }
  }
}
\</script\>
```





# 12.provide和 inject(依赖注入)

\> 在父子组件传递数据时，通常使用的是 props 和 emit，父传子时，使用的是 props，如果是父组件传孙组件时，就需要先传给子组件，子组件再传给孙组件，如果多个子组件或多个孙组件使用时，就需要传很多次，会很麻烦。
\>
\> 像这种情况，可以使用 provide 和 inject 解决这种问题，不论组件嵌套多深，父组件都可以为所有子组件或孙组件提供数据，父组件使用 provide 提供数据，子组件或孙组件 inject 注入数据。同时兄弟组件之间传值更方便。

\> 如果父组件链上多个组件对同一个 key 提供了值，那么离得更近的组件将会“覆盖”链上更远的组件所提供的值。如果没有能通过 key 匹配到值，`inject()` 将返回 `undefined`

==父组件==

```vue
\<!--App.vue--\>
\<template\>
  \<hello-world\>\</hello-world\>
\</template\>
\<script\>
import HelloWorld from "./components/HelloWorld.vue"
import { provide } from "vue";
export default {
  components: { HelloWorld },
  name: "App",
  setup() {
    provide("msg","我是父组件的数据")
  },
};
\</script\>

```

==子组件==

```vue
\<!--HelloWorld.vue--\>
\<template\>
   \<h1\>我是子组件\</h1\>
   \<grand-son\>\</grand-son\>
\</template\>

\<script\>
import { inject } from 'vue'
import GrandSon from "./GrandSon.vue"


export default {
  components: { GrandSon },
  name: 'HelloWorld',
  setup(){
   const info= inject("msg");
   console.log("子组件",info)
  },
}
\</script\>
```

==孙子组件==

```vue
\<!--grandson.vue--\>
\<template\>
    \<div\>
        我是孙子组件
    \</div\>
\</template\>

\<script\>
import { inject } from 'vue';
export default {
    setup () {
       const info= inject("msg");
       console.log("孙子组件",info)
    }
}
\</script\>

```

当然也可以传递响应式的值，并且子组件修改数据的时候其他组件也会更新

```vue
\<!--App.vue--\>
\<template\>
  \<h1 @click="change"\>我是父组件: {{person}}\</h1\>
  \<hello-world\>\</hello-world\>
\</template\>
\<script\>
import HelloWorld from "./components/HelloWorld.vue"
import { provide, reactive } from "vue";
export default {
  components: { HelloWorld },
  name: "App",
  setup() {
    const person=reactive({
      name:"小明",
      age:18
    })
  function change(){
    person.name="小红"
  }

    provide("msg",person)
    return{
      person,change
    }
  },
};
\</script\>
\<!--HelloWorld.vue--\>
\<template\>
   \<h1 @click="change"\>我是子组件 {{info}}\</h1\>
   \<grand-son\>\</grand-son\>
\</template\>

\<script\>
import { inject } from 'vue'
import GrandSon from "./GrandSon.vue"
export default {
  components: { GrandSon },
  name: 'HelloWorld',
  setup(){
   const info= inject("msg");
   console.log("子组件",info);
   function change(){
    info.name="小红"
  }
   return{
    info,change
   }
  },
}
\</script\>
\<!--grandSon.vue--\>
\<template\>
    \<div\>
        我是孙子组件 {{info}}
    \</div\>
\</template\>
\<script\>
import { inject } from 'vue';
export default {
    setup () {
       const info= inject("msg");
       console.log("孙子组件",info)
       return{
        info
       }
    }
}
\</script\>

```



但是在通常情况下，我们不允许子组件修改父组件传递过去的数据，此时可以采用readonly

==App.vue==

```js
provide("msg",readonly(person) )
```

此时只有父组件自己能改，子组件无法更改



如果我们确实希望改变父组件的数据，此时我们可以在父组件中设置方法，通过provide将该方法传递给子组件，保证数据是数据提供的位置进行修改。

```js
//App.vue
provide("msg",readonly(person) );
provide("change",change)
//HelloWorld.vue
setup(){
   const info= inject("msg");
   const change=inject("change")
   console.log("子组件",info);
   return{
    info,change
   }
  },	
```



# 13.属性的透传

\> 当一个组件以单个元素为根作渲染时，透传的 attribute 会自动被添加到根元素上

当我使用一个组件，直接给组件身上加class或者id属性或者style属性

```vue
\<!--父组件--\>
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<Child class="box" id="box" style="color: red;"/\>
  \</div\>
\</template\>
\<script\>
import Child from './Child.vue';
export default {
  components: {
    Child
  },
};
\</script\>
\<!--子组件--\>
\<template\>
  \<div\>我是一个子组件\</div\>
\</template\>
```

最终结果：我们会发现我们没有定义props接收这个属性，但是子组件也能正常使用。

![image-20240809145937222](/vue3/image-20240809145937222.png)



\> 如果一个子组件的根元素已经有了 `class` 或 `style` attribute，它会和从父组件上继承的值合并



\> 同样的规则也适用于 `v-on` 事件监听器：



\> 禁用透传

```vue
\<script setup\>
defineOptions({
  inheritAttrs: false
})
// ...setup 逻辑
\</script\>
```



## 多根节点的透传

```vue
\<template\>
  \<div \>我是一个子组件\</div\>
  \<div  v-bind="$attrs"\>我也是一个子组件\</div\>
\</template\>
```



## 在 JavaScript 中访问透传 Attributes

```vue
\<script setup\>
import { useAttrs } from 'vue'

const attrs = useAttrs()
\</script\>
```

如果没有使用 `\<script setup\>`，`attrs` 会作为 `setup()` 上下文对象的一个属性暴露：

```javascript
export default {
  setup(props, ctx) {
    // 透传 attribute 被暴露为 ctx.attrs
    console.log(ctx.attrs)
  }
}
```

==注意：多根节点的组件，Vue 3 默认不支持将从父组件传入的所有属性默认传递到所有根节点，如果非要支持，需要配合attrs属性实现==

```vue
\<!--父组件--\>
\<template\>
  \<div\>
    \<Child id="aa" class="bb" style="width:100px"/\>
  \</div\>
\</template\>
\<script \>
import Child from './Child.vue';
export default {
  components:{
    Child
  }
}
\</script\>

```

```vue
\<!--子组件--\>
\<template\>
  \<h1 :id="attrsForFirstRoot.id" :class="attrsForFirstRoot.class"\>我是子组件\</h1\>
  \<h1 :style="attrsForSecondRoot.style"\>123123\</h1\>
\</template\>

\<script\>
import { computed } from 'vue';
export default {
  setup(props, { attrs }) {
    const attrsForFirstRoot = computed(() =\> {
      return {
        id: attrs.id,
        class: attrs.class
      };
    });

    const attrsForSecondRoot = computed(() =\> {
      return {
        style: attrs.style
      };
    })
    return {
      attrsForFirstRoot,attrsForSecondRoot
    }
  }
}
\</script\>
```



# 14.动态组件

1. **`\<component\>` 标签**: `\<component\>` 是一个内置的组件，它使用 `:is` 属性来决定要渲染哪个组件。
2. **`:is` 属性**: `:is` 可以绑定到一个局部组件、全局组件或组件的名称字符串。根据 `:is` 的值变化，Vue 将在同一位置动态地加载和卸载不同的组件。

**基本用法**

```vue
\<template\>
  \<div\>
    \<button @click="currentComponent = 'HomeComponent'"\>Home\</button\>
    \<button @click="currentComponent = 'AboutComponent'"\>About\</button\>
    
    \<component :is="currentComponent"\>\</component\>
  \</div\>
\</template\>

\<script\>
import HomeComponent from './HomeComponent.vue';
import AboutComponent from './AboutComponent.vue';

export default {
  components: {
    HomeComponent,
    AboutComponent
  },
  data() {
    return {
      currentComponent: 'HomeComponent'
    };
  }
}
\</script\>
```

# 15.KeepAlive

`\<keep-alive\>` 是一个内置组件，用于缓存组件实例而非销毁它们。这在进行组件切换时非常有用，特别是在需要保持组件状态或避免重复渲染开销的场景中。使用 `\<keep-alive\>` 可以保持组件的状态或避免重新执行初始化操作。

```vue
\<!-- 非活跃的组件将会被缓存！ --\>
\<KeepAlive\>
  \<component :is="activeComponent" /\>
\</KeepAlive\>
```

关于include和exclude关键字

- **`include`**: 一个字符串或正则表达式，用于定义哪些组件应该被缓存。如果 `include` 是设置的，只有名称匹配的组件会被缓存。
- **`exclude`**: 一个字符串或正则表达式，用于定义哪些组件不应该被缓存。如果设置了 `exclude`，名称匹配的组件将不会被缓存。

它会根据组件的 name 选项进行匹配，所以组件如果想要条件性地被 KeepAlive 缓存，就必须显式声明一个 name 选项。

案例

```vue
\<!-- UserProfile.vue --\>
\<template\>
  \<div\>User Profile\</div\>
\</template\>

\<script\>
export default {
  name: 'UserProfile'
}
\</script\>

\<!-- Settings.vue --\>
\<template\>
  \<div\>Settings\</div\>
\</template\>

\<script\>
export default {
  name: 'Settings'
}
\</script\>

\<!-- TodoList.vue --\>
\<template\>
  \<div\>Todo List\</div\>
\</template\>

\<script\>
export default {
  name: 'TodoList'
}
\</script\>
```

```vue
\<template\>
  \<keep-alive :include="['UserProfile', 'Settings']" :exclude="'TodoList'"\>
    \<component :is="currentComponent" /\>
  \</keep-alive\>
  \<button @click="currentComponent = 'UserProfile'"\>User Profile\</button\>
  \<button @click="currentComponent = 'Settings'"\>Settings\</button\>
  \<button @click="currentComponent = 'TodoList'"\>Todo List\</button\>
\</template\>

\<script\>
import UserProfile from './UserProfile.vue'
import Settings from './Settings.vue'
import TodoList from './TodoList.vue'

export default {
  components: {
    UserProfile,
    Settings,
    TodoList
  },
  data() {
    return {
      currentComponent: 'UserProfile'
    }
  }
}
\</script\>
```

\> **正则表达式的使用**

如果组件较多，可以使用正则表达式来简化这些属性的使用。例如，如果你想缓存所有以`Profile` 结尾的组件，可以用：

```vue
\<keep-alive :include="/.*Profile$/"\>
    \<component :is="currentComponent" /\>
\</keep-alive\>
```

\> **缓存实例的生命周期**

当一个组件实例从 DOM 上移除但因为被 `\<KeepAlive\>` 缓存而仍作为组件树的一部分时，它将变为**不活跃**状态而不是被卸载。当一个组件实例作为缓存树的一部分插入到 DOM 中时，它将重新**被激活**。

一个持续存在的组件可以通过 [`onActivated()`](https://cn.vuejs.org/api/composition-api-lifecycle.html#onactivated) 和 [`onDeactivated()`](https://cn.vuejs.org/api/composition-api-lifecycle.html#ondeactivated) 注册相应的两个状态的生命周期钩子：

vue

```vue
\<script setup\>
import { onActivated, onDeactivated } from 'vue'

onActivated(() =\> {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
})

onDeactivated(() =\> {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
})
\</script\>
```

请注意：

- `onActivated` 在组件挂载时也会调用，并且 `onDeactivated` 在组件卸载时也会调用。

# 16.自定义指令

在 `\<script setup\>` 中，任何以 `v` 开头的驼峰式命名的变量都可以被用作一个自定义指令。

**简单的自定义指令示例，该指令的功能是使用 JavaScript 自动聚焦到某个元素上**

```vue
\<template\>
  \<div\>
    \<h1\>我是根组件\</h1\>
    \<input type="text" v-focus\>
  \</div\>
\</template\>
\<script\>
const focus = {
  mounted(el) {
    el.focus();
  }
};
export default {
  directives: {
    focus
  }
};
\</script\>
```

\> 关于自定义指令的注册

### 1.全局注册

```js
import { createApp } from 'vue';
import App from './App.vue';
import { AutoFocus } from './directives/AutoFocus';

const app = createApp(App);

// 全局注册自定义指令
app.directive('auto-focus', AutoFocus);

app.mount('#app');
```

### 2.组件内注册

```js
// 在某个 Vue 组件内
import { AutoFocus } from '../directives/AutoFocus';

export default {
  directives: {
    AutoFocus
  }
};
```



在没有使用 `\<script setup\>` 的情况下，自定义指令需要通过 `directives` 选项注册：

```vue
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```

### 3.指令钩子

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

### 4.钩子参数[](https://cn.vuejs.org/guide/reusability/custom-directives.html#hook-arguments)

指令的钩子会传递以下几种参数：

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`：一个对象，包含以下属性。
  - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 VNode。
- `prevVnode`：代表之前的渲染中指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

\> 使用自定义指令控制元素的显示与隐藏案例

```vue
\<template\>
  \<div\>
    \<button @click="isVisible = !isVisible"\>Toggle Div\</button\>
    \<div v-toggle="isVisible"\>
      Look at me! I can be shown or hidden.
    \</div\>
  \</div\>
\</template\>

\<script\>
const Toggle = {
  created(el, binding) {
    // 设置元素的初始可见状态
    el.style.display = binding.value ? '' : 'none';
  },
  updated(el, binding) {
    // 根据绑定值的变化更新元素的显示状态
    if (binding.value !== binding.oldValue) {
      el.style.display = binding.value ? '' : 'none';
    }
  }
};
export default {
  data() {
    return {
      isVisible: true
    };
  },
  directives:{
    Toggle
  }
};
\</script\>
```



# 17.单文件组件 \\<script setup\>

\> 在 \<script\> 代码块上添加 setup属性，里面的代码会被编译成组件 setup() 函数的内容

当使用 \<script setup\> 的时候，任何在 \<script setup\> 声明的顶层的绑定 (包括变量，函数声明，以及 import 导入的内容) 都能在模板中直接使用：

```vue
\<template\>
  \<h1 @click="b"\>{{a}}\</h1\>
\</template\>
\<script setup\>
  const a=10
  function b(){
    console.log(123)
  }
\</script\>
```



## 1.属性方法无需返回

```vue
\<template\>
  \<div\>
    \<h2 @click="ageInc"\>{{ name }} is {{ age }}\</h2\>
  \</div\>
\</template\>

\<script setup\>
import { ref } from 'vue';

const name = ref('CoCoyY1')
const age = ref(18)

const ageInc = () =\> {
  age.value++
}

\</script\>

```



## 2.自动注册子组件

\<script setup\> 范围里的值也能被直接作为自定义组件的标签名使用：

```vue
\<script setup\>
import MyComponent from './MyComponent.vue'
\</script\>

\<template\>
  \<MyComponent /\>
\</template\>
```



## 3.动态组件

\> 由于组件是通过变量引用而不是基于字符串组件名注册的，
\>
\> 在 \<script setup\> 中要使用动态组件的时候，应该使用动态的 :is 来绑定

```vue
\<template\>
    \<div\>
        \<component :is="GrandSon"\>\</component\>
    \</div\>
\</template\>

\<script setup\>
 //import HelloWorld from './components/HelloWorld.vue';
 import GrandSon from "./components/GrandSon.vue"
\</script\>
```

## 4.自定义指令

本地的自定义指令在 `\<script setup\>` 中不需要显式注册，但他们必须遵循 `vNameOfDirective` 这样的命名规范：

```vue
\<script setup\>
const vMyDirective = {
  beforeMount: (el) =\> {
    // 在元素上做些操作
  }
}
\</script\>
\<template\>
  \<h1 v-my-directive\>This is a Heading\</h1\>
\</template\>
```

## 5.useAttrs

之前讲的属性的透传，可以使用useAttrs获取

```javascript
\<script setup\>
import { useAttrs } from 'vue'

const attrs = useAttrs()
\</script\>
```

## 6.defineProps

- `defineProps` 和 `defineEmits` 都是只能在 `\<script setup\>` 中使用的**编译器宏**。他们不需要导入，且会随着 `\<script setup\>` 的处理过程一同被编译掉。

`defineProps` 接收与 `props` 选项相同的值，

```vue
\<!--App.vue--\>
\<template\>
  \<div\>
    \<h2 \>我是父组件！\</h2\>
   \<my-child msg="hello"\>\</my-child\>
  \</div\>
\</template\>

\<script setup\>

import MyChild from "./MyChild.vue"
\</script\>


\<!--MyChild.vue--\>
\<template\>
  \<h1\>我是子组件 {{props.msg}}\</h1\>
\</template\>

\<script setup\>

const props=defineProps({
  msg:String
})
\</script\>

```

```js
defineProps({
  // 基础类型检查
  // （给出 `null` 和 `undefined` 值则会跳过任何类型检查）
  propA: Number,
  // 多种可能的类型
  propB: [String, Number],
  // 必传，且为 String 类型
  propC: {
    type: String,
    required: true
  },
  // 必传但可为 null 的字符串
  propD: {
    type: [String, null],
    required: true
  },
  // Number 类型的默认值
  propE: {
    type: Number,
    default: 100
  },
  // 对象类型的默认值
  propF: {
    type: Object,
    // 对象或数组的默认值
    // 必须从一个工厂函数返回。
    // 该函数接收组件所接收到的原始 prop 作为参数。
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // 自定义类型校验函数
  // 在 3.4+ 中完整的 props 作为第二个参数传入
  propG: {
    validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // 函数类型的默认值
  propH: {
    type: Function,
    // 不像对象或数组的默认，这不是一个
    // 工厂函数。这会是一个用来作为默认值的函数
    default() {
      return 'Default function'
    }
  }
})
```

校验选项中的 `type` 可以是下列这些原生构造函数：

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

## 7.defineEmits

```vue
\<!--App.vue--\>
\<template\>
  \<div\>
    \<h2 \>我是父组件！\</h2\>
   \<my-child msg="hello" @fn="change"\>\</my-child\>
  \</div\>
\</template\>

\<script setup\>

import MyChild from "./MyChild.vue"
function change(){
  alert(123)
}
\</script\>

\<!--MyChild.vue--\>
\<template\>
  \<h1 @click="a"\>我是子组件 {{props.msg}}\</h1\>
\</template\>

\<script setup\>

const props=defineProps({
  msg:String
})

const emit=defineEmits(["fn","fn2"])

function a(){
  emit("fn")
}
\</script\>
```

## 8.defineExpose

\> **补充前置知识：关于ref获取组件对象**
\>
\> Vue3 中通过 ref 访问元素节点与 Vue2 不太一样，在 Vue3 中我们是没有 this 的，所以当然也没有 this.$refs。想要获取 ref，我们只能通过声明变量的方式。

```vue
\<template\>
  \<div ref="hello"\>hello\</div\>
\</template\>
\<script setup\>
import { onMounted} from "vue";
const hello = ref(null);
onMounted(() =\> {
  console.log(hello.value); // \<div\>hello\</div\>
});
\</script\>
```

上段代码中我们同样给 div 元素添加了 ref 属性，为了获取到这个元素，我们声明了一个与 ref 属性名称相同的变量 hello，然后我们通过 hello.value 的形式便获取到了该 div 元素。

**注意点：**

- 变量名称必须要与 ref 命名的属性名称一致。
- 通过 hello.value 的形式获取 DOM 元素。
- 必须要在 DOM 渲染完成后才可以获取 hello.value，否则就是 null。



以前我们父组件调用子组件的方式是这么写的

```vue
\<!--父组件--\>
\<template\>
  \<div\>
    \<HelloWorld ref="child" /\>
    \<button @click="change"\>按钮\</button\>
  \</div\>
\</template\>
\<script \>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: {
    HelloWorld,
  },
  methods:{
    change(){
        this.$refs.child.fn()
    }
  }
};
\</script\>
\<!----------------------子组件--------------------------------\>
\<template\>
    \<div\>
        \<h1 \>我是子组件\</h1\>
    \</div\>
\</template\>

\<script\>
export default {
    methods:{
        fn(){
            alert(1)
        }
    }
}
\</script\>

```

\> 但是子组件是\<script setup\>时，父组件直接调用就会提示方法未定义。官网有这么一句话：使用 \<script setup\> 的组件是默认关闭的，也即通过模板 ref 或者 $parent 链获取到的组件的公开实例，不会暴露任何在 \<script setup\> 中声明的绑定。因此，父组件是不能直接访问子组件的方法。需要子组件手动的抛出才行。

此时只需要子组件做如下修改，父组件就可以正常调用

```vue
\<template\>
    \<div\>
        \<h1 \>我是子组件\</h1\>
    \</div\>
\</template\>

\<script setup\>
import { ref } from 'vue';
let a=ref(100)
function fn(){
    alert(1)
}
defineExpose({
    fn,a
})
\</script\>
```

```vue
\<!--父组件--\>
\<template\>
  \<div\>
    \<HelloWorld ref="child" /\>
    \<button @click="change"\>按钮\</button\>
  \</div\>
\</template\>

\<script \>
import HelloWorld from "./components/HelloWorld.vue";
export default {
  components: {
    HelloWorld,
  },
  methods:{
    change(){
      this.$refs.child.fn()  
       console.log( this.$refs.child.a)
    }
  }
};
\</script\>
\<!----------------------------vue3写法----------------------------------------\>
\<script setup\>
import HelloWorld from "./components/HelloWorld.vue";
import { ref} from 'vue'
const child = ref(null);
    function change(){
        child.value.fn()
    }

\</script\>
```

## 9.defineModel

\> `defineModel`是一个宏，所以不需要从vue中`import`导入，直接使用就可以了。这个宏可以用来声明一个双向绑定 prop，通过父组件的 `v-model` 来使用。

https://www.cnblogs.com/heavenYJJ/p/18006048

我们知道v-model适用于表单，并不能直接用于组件，如果我们想封装一下，让组件可以使用v-model,一般我们会这么做

当在自定义组件上使用 `v-model` 时，Vue 会自动映射到以下两个方面：

1. **Prop 名称**：默认情况下，`v-model` 绑定的 prop 名称是 `modelValue`。
2. **事件名称**：默认情况下，`v-model` 绑定的事件名称是 `update:modelValue`。

因此，`v-model` 会自动绑定到名为 `modelValue` 的 prop，并且会监听名为 `update:modelValue` 的事件，以实现双向绑定的效果。

```vue
\<!--父组件--\>
\<template\>
  \<div\>
    \<Child v-model="inputValue" /\>
    \<p\>Input Value: {{ inputValue }}\</p\>
  \</div\>
\</template\>

\<script\>
import Child from './Child.vue';

export default {
  components: {
    Child
  },
  data() {
    return {
      inputValue: ''
    };
  }
};
\</script\>

\<!--子组件--\>
\<template\>
  \<input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" /\>
  \<h1\>我是子组件{{ modelValue }}\</h1\>
\</template\>

\<script setup\>
defineProps(["modelValue"])
\</script\>
```

有了defineModel后直接修改子组件的代码

```vue
\<template\>
  \<input v-model="model" /\>
\</template\>

\<script setup \>
const model = defineModel();
\</script\>
```

\> `defineModel`的返回值是一个`ref`，我们可以在子组件中修改`model`变量的值，并且父组件中的`inputValue`变量的值也会同步更新，这样就可以实现双向绑定。

defineModel其实就是在子组件内定义了一个叫model的ref变量和modelValue的props，并且watch了props中的modelValue。当props中的modelValue的值改变后会同步更新model变量的值。并且当在子组件内改变model变量的值后会抛出update:modelValue事件，父组件收到这个事件后就会更新父组件中对应的变量值。

\> 那既然defineModel是定义一个属性，那么这个属性能否像props那样设置属性呢

```js
const model = defineModel({ type: String, default: "20" });//也是可以的，和props的类型规定是一样的
```

\> 那如果有多个双向绑定呢

```vue
\<template\>
  \<div\>
    \<Child v-model:aa="inputValue1" /\>
    \<Child v-model:bb="inputValue2" /\>
  \</div\>
\</template\>

\<script\>
import Child from './Child.vue';

export default {
  components: {
    Child
  },
  data() {
    return {
      inputValue1: '11',
      inputValue2: '22'
    };
  }
};
\</script\>
\<!--子组件--\>
\<template\>
  \<input v-model="model1" /\>
  \<h1\>我是子组件model1{{ model1 }}\</h1\>
  \<input v-model="model2" /\>
  \<h1\>我是子组件model2{{ model2 }}\</h1\>
\</template\>

\<script setup \>
const model1 = defineModel("aa");
const model2 = defineModel("bb");
    // 或者：声明带选项的 "count" prop
const count = defineModel("count", { type: Number, default: 0 })
\</script\>
```



## 10.defineComponent

\> vue3中，新增了 defineComponent ，它并没有实现任何的逻辑，只是对setup函数进行封装，返回options的对象，它的存在是完全让传入的整个对象获得对应的类型，它的存在就是完全为了服务 TypeScript 而存在的，在TypeScript下，给予了组件 正确的参数类型推断

```vue
\<template\>
  \<div @click="change"\>{{ str }}\</div\>
  
\</template\>
\<script\>
  import { ref, defineComponent } from 'vue'
  export default defineComponent({
    created(){
        alert(1)
    },
    setup() {
      const str = ref(123)
        function change(){
          str.value="hello"
        }
      return {
        str,change
      }
    }
  })
\</script\>

```



# 18.Teleport(瞬移组件)

\> `\<Teleport\>` 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。

最简单用法

```vue
\<template\>
  \<div\>hello\</div\>
  \<teleport to="body"\>
    \<div class="modal"\>我是一个弹窗\</div\>
  \</teleport\>
\</template\>
```

审查元素可以发现，我们的modal添加了body下而不是app下

![image-20220827225629966](/vue3/image-20220827225629966.png)

```vue
\<!--可以用其他的css选择器--\>
\<teleport to="#some-id" /\>
\<teleport to=".some-class" /\>
\<teleport to="[data-teleport]" /\>
```

# 19.跨域问题

在 Vite 中，你可以通过修改 Vite 配置文件 `vite.config.js` （或者 `vite.config.ts`，如果你使用 TypeScript）来设置代理，具体步骤如下：

1. **打开或创建 `vite.config.js` 文件**

2. **在配置文件中添加代理设置**

   代理配置通常在 `server.proxy` 选项下定义。例如，如果你的前端应用尝试访问 `/api` 路径下的资源，而实际的后端服务是部署在 `http://localhost:8080`，你可以按照以下方式设置代理：

   ```js
   import { fileURLToPath, URL } from 'node:url'
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   // https://vitejs.dev/config/
   export default defineConfig({
     plugins: [
       vue(),
     ],
     resolve: {
       alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url))
       }
     },
     server: {
       proxy: {
         '/api': {
           target: 'https://api.jisuapi.com/tv',
           changeOrigin: true,
           rewrite: (path) =\> path.replace(/^\/api/, '')
         }
       }
     }
   
   })
   
   ```

   

   

   

   在此配置中，`changeOrigin: true` 修改了代理请求的源，`rewrite` 配置项用于修改实际发送到后端的路径，这里是去掉路径中的 `/api` 部分。


# 17.vue2 vs vue3

1.vue3组件可以包含多个根节点， vue2只能包含一个根节点

2.vue3组合式api,新增\<script setup\>语法糖

3.vue3新增teleport组件

4.vue3支持多个根节点



## 非兼容性更改

1.v-if 与 v-for两者作用于同一个元素上时，`v-if` 会拥有比 `v-for` 更高的优先级。

2.在 2.x 中，`render` 函数会自动接收 `h` 函数，在 3.x 中，`h` 函数现在是全局导入的，而不是作为参数自动传递

3.不再支持使用数字 (即键码) 作为 `v-on` 修饰符



# 18.Vue-Router

路由中文官网

https://router.vuejs.org/zh/

安装

\> npm install vue-router@4



## 1.创建路由

==src-router-index.js==

```js
import { createRouter,createWebHashHistory } from 'vue-router'
import Home from "../components/Home.vue"
import About from "../components/About.vue"
const routes = [
    { path: '/', component: Home ,name:"home"},//name属性可选，作为路由的名字，跳转的时候可以用
    { path: '/about', component: About },
  ]
  
let vueRouter=createRouter({ //Vue Router 不再是一个类，而是一组函数。现在你不用再写 new Router()，而是要调用 createRouter:
    routes,
    history: createWebHashHistory(), //mode: 'history' 配置已经被一个更灵活的 history 配置所取代。根据你使用的模式，你必须用适当的函数替换它：
})
export default vueRouter
```

- `"history"`: `createWebHistory()` ==HTML5 模式（推荐）==

- `"hash"`: `createWebHashHistory()`

它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。不过，**它在 SEO 中确实有不好的影响**。如果你担心这个问题，可以使用 HTML5 模式

==main.js==

\> 注册路由插件

```js
import router from "./router/index"
createApp(App).use(router).mount('#app')
//或者下面这个写法也可以
const app = createApp(App)
app.use(router)
app.mount('#app')
```

和大多数的 Vue 插件一样，`use()` 需要在 `mount()` 之前调用。

如果你好奇这个插件做了什么，它的职责包括：

1. [全局注册](https://cn.vuejs.org/guide/components/registration.html#global-registration) `RouterView` 和 `RouterLink` 组件。
2. 添加全局 `$router` 和 `$route` 属性。
3. 启用 `useRouter()` 和 `useRoute()` 组合式函数。
4. 触发路由器解析初始路由。

如果出现了图中报错

![image-20240718191435927](/vue3/image-20240718191435927.png)

==解决方案==

\> 解决:
\>
\> 关闭 JavaScript 的验证启用，在 VSCode 的 settings.json 文件，增加 JSON 格式代码：
\>
\> （MAC 通过 command + P 搜索 settings.json 或 在[vscode](https://link.zhihu.com/?target=https%3A//so.csdn.net/so/search%3Fq%3Dvscode%26spm%3D1001.2101.3001.7020)中Crtl+shift+P，输入setting.json）
\>
\> 在代码中输入`"javascript.validate.enable": false`即可解决

## 2.router-view和router-link

\> 组件 RouterView 和 RouterLink 都是全局注册的，因此它们不需要在组件模板中导入。但你也可以通过局部导入它们，例如 import { RouterLink } from 'vue-router'。
\>
\> 在模板中，组件的名字可以是 PascalCase 风格或 kebab-case 风格的。Vue 的模板编译器支持两种格式，因此 \<RouterView\> 和 \<router-view\> 通常是等效的。此时应该遵循你自己项目中使用的约定。

![image-20240718192159381](/vue3/image-20240718192159381.png)

\> 关于router-link的使用

`\<RouterLink\>` 的基本用法相对简单，以下是几个示例和说明：

1. **链接到路径**： 直接使用 `to` 属性指定要导航到的路由路径。

   ```
   \<RouterLink to="/about"\>About Us\</RouterLink\>Copy
   ```

2. **使用路由名称**： 如果你在路由配置中使用了命名路由，可以通过传递一个对象到 `to` 属性来指定路由的 `name`。

   ```
   \<RouterLink :to="{ name: 'user', params: { userId: 123 }}"\>User Profile\</RouterLink\>Copy
   ```

   这里 `name` 对应路由配置中的路由名称，`params` 对应路由参数。

3. **带查询参数的链接**： 向 `to` 属性的对象中添加 `query` 属性，来指定URL的查询参数。

   ```
   \<RouterLink :to="{ name: 'search', query: { keyword: 'vue' }}"\>Search\</RouterLink\>Copy
   ```

   上面的链接会生成URL，如 `/search?keyword=vue`。



## 3.动态路由

多个路径匹配同一路由界面

$route表示当前路由对象：

![image-20240718192659059](/vue3/image-20240718192659059.png)

也可以添加多个动态路由

![image-20240718192907953](/vue3/image-20240718192907953.png)

⚠️==注意==

两个不同的动态路由，切换动态路径时，相同的组件实例将被重复使用。因为两个路由都渲染同个组件，这也意味着组件的生命周期钩子不会被调用

要对同一个组件中参数的变化做出响应的话，你可以简单地 watch $route 对象上的任意属性，在这个场景中，就是 $route.params ：

```vue
\<script setup\>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
watch(() =\> route.params.id, (newId, oldId) =\> {
  // 对路由变化做出响应...
})
\</script\>
```

使用组件的onUpdated钩子也可以监测到动态路由部分的变化，但是不推荐

`onUpdated` 更适合用于响应组件内数据变化引起的 DOM 更新，而不是用来检测路由变化。要有效监听动态路由的变化，应当使用 Vue Router 提供的相关 API，

## 4.编程式的导航

我们可以通过router-link标签跳转，但是很多时候不是通过点击标签跳转，比如当登陆成功的时候跳转，这种就不是点击，而是作为某个事件的回调；

**因为我们在 setup 里面没有访问 this，所以我们不能直接访问 this.$router 或 this.$route。作为替代，我们使用 useRouter 和 useRoute 函数：**

\> 通过调用useRouter获取路由对象

```js
const router = useRouter()
// 字符串路径
router.push('/users/eduardo')

// 带有路径的对象
router.push({ path: '/users/eduardo' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { username: 'eduardo' } })

// 带查询参数，结果是 /register?plan=private
router.push({ path: '/register', query: { plan: 'private' } })

// 带 hash，结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```

\> 替换当前位置

它的作用类似于 `router.push`，唯一不同的是，它在导航时不会向 history 添加新记录，正如它的名字所暗示的那样——它取代了当前的条目。

| 声明式                            | 编程式                |
| :-------------------------------- | :-------------------- |
| `\<router-link :to="..." replace\>` | `router.replace(...)` |

也可以直接在传递给 `router.push` 的 `to` 参数中增加一个属性 `replace: true` ：

```js
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```



## 5.嵌套路由

如果某个组件内部还有路由，那么就需要在该组件内部再定义 router-view

对应的路由配置项的配置

```js
const routes = [
  {
    path: '/user',
    component: User,
    children: [
      {
        // 当 /user/profile 匹配成功
        // UserProfile 将被渲染到 User 的 \<router-view\> 内部
        path: 'profile',
        component: UserProfile,
      },
      {
        // 当 /user/posts 匹配成功
        // UserPosts 将被渲染到 User 的 \<router-view\> 内部
        path: 'posts',
        component: UserPosts,
      },
    ],
  },
]
```

⚠️：子路由的路径前面不加斜杠，默认是在父路由的基础上去叠加

以斜杠打头的默认都是根路径，如果你的子路由路径写成了/profile，那么默认就不是在父路由的基础上叠加了

## 6.命名视图

直接参考官方案例

![image-20240718195527444](/vue3/image-20240718195527444.png)

## 7.重定向和别名

\> 重定向

重定向也是通过 `routes` 配置来完成，下面例子是从 `/home` 重定向到 `/`：

```
const routes = [{ path: '/home', redirect: '/' }]
```

重定向的目标也可以是一个命名的路由：

```
const routes = [{ path: '/home', redirect: { name: 'homepage' } }]


```

在写 `redirect` 的时候，可以省略 `component` 配置，因为它从来没有被直接访问过，所以没有组件要渲染。唯一的例外是[嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)：如果一个路由记录有 `children` 和 `redirect` 属性，它也应该有 `component` 属性。

\> 别名

```js
const routes = [{ path: '/', component: Homepage, alias: '/home' }]
```

## 8.路由的传参

![image-20240718200119404](/vue3/image-20240718200119404.png)

当 `props` 设置为 `true` 时，`route.params` 将被设置为组件的 props。

URL `/search?q=vue` 将传递 `{query: 'vue'}` 作为 props 传给 `SearchUser` 组件。

对于有命名视图的路由，你必须为每个命名视图定义 `props` 配置：

```js
const routes = [
  {
    path: '/user/:id',
    components: { default: User, sidebar: Sidebar },
    props: { default: true, sidebar: false }
  }
]
```



## 9.通配符

**vue2:**

```js
import { createRouter,createWebHashHistory } from 'vue-router'
import Home from "../components/Home.vue"
import About from "../components/About.vue"
import NotFound from "../components/NotFound.vue"
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '*', component: NotFound },
  ]
  
```

**vue3:**

```js
import Home from './components/Home.vue';
import NotFound from './components/NotFound.vue';

const routes = [
  { path: '/', component: Home },
  // 其他路由规则...
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

- ```
  /:pathMatch(.*)*
  ```

  : 这是一个通配符路由。

  - `:pathMatch` 是动态路由的参数名，你可以随意命名，但通常命名为 `pathMatch` 以表明它的用途。
  - `(.*)` 是一个正则表达式，用于匹配任意字符串。
  - `*` 表示这个匹配规则可以应用于任意数量的路径段，使得 `/any/random/path` 都能匹配到。

## 10.keep-alive的使用

**vue-router 3.x**

```vue
  \<keep-alive\>
      \<router-view\>\</router-view\>
   \</keep-alive\>
```



**vue-router 4.x**

按照之前的使用会报警告

![image-20230818143246931](/vue3/image-20230818143246931.png)

正确写法

```vue
\<router-view v-slot="{ Component }"\>
  \<keep-alive\>
    \<component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" /\>
  \</keep-alive\>
  \<component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" /\>
\</router-view\>
```

在 `v-slot` 后面的对象包含以下属性:

- `Component`: 这是一个通过命名插槽将匹配到的组件传递给插槽的属性。你可以在模板中使用 `Component` 属性来渲染匹配到的组件。例如，`\<component :is="Component" /\>` 将会渲染匹配到的组件。
- `route`: 这是当前路由的信息对象。它具有以下属性：
  - `path`: 当前路由的路径。
  - `params`: 一个对象，包含动态路径参数和其对应的值。
  - `query`: 一个对象，包含查询参数和其对应的值。
  - `hash`: URL 中的 hash 部分。
- `router`: 这是 Vue Router 的实例，它提供了一些实用方法和属性，例如 `router.push()` 和 `router.go()`。
- `slotProps`: 这是 `\<router-view\>` 组件内部的插槽属性对象。它可以包含一些额外的属性，它们是为特定路由设置的属性。通常，你可以在路由配置中使用 `meta` 属性来定义这些属性。

## 11.配合组合式api

因为我们在 setup 里面没有访问 this，所以我们不能再直接访问 this.$router 或 this.$route。作为替代，我们使用 useRouter 和 useRoute 函数：

```JS
import { useRouter, useRoute } from 'vue-router'
export default {
    setup() {
        console.log(useRoute())
        console.log(useRouter())
        return {}
    }
}
```



## 12.导航守卫

\> 全局前置守卫

```js
const router = createRouter({ ... })

router.beforeEach((to, from) =\> {
  // ...
  // 返回 false 以取消导航
  return false
})
```

导航守卫可以返回的值有

- false: 取消导航
- 路由对象：通过一个路由地址重定向到一个不同的地址，如同调用 `router.push()`，且可以传入诸如 `replace: true` 或 `name: 'home'` 之类的选项。它会中断当前的导航，同时用相同的 `from` 创建一个新导航。
- 不写返回值：继续执行

```js
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // 路由定义...
  ]
});

 router.beforeEach(async (to, from) =\> {
   if (
     // 检查用户是否已登录
     !isAuthenticated &&
     // ❗️ 避免无限重定向
     to.name !== 'Login'
   ) {
     // 将用户重定向到登录页面
     return { name: 'Login' }
   }
 })
```

\> 全局解析守卫
\>

这个守卫在所有组件内守卫和异步路由组件被解析后执行，但是在导航被确认之前运行。这意味着所有的异步操作（比如数据获取或异步组件解析）都已完成。``

```js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [ /* 你的路由对象 */ ];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve(async (to, from) =\> {
  // 你可以在这里加入你的逻辑
  // 例如，检查用户权限，或者再次确认已加载所有内容
  console.log('beforeResolve guard');

});

export default router;
```

\> 全局后置钩子

和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身,并且不需要返回值

```js
router.afterEach((to, from) =\> {
  sendToAnalytics(to.fullPath)
})
```

\> 路由独享的守卫

```JS
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) =\> {
      // reject the navigation
      return false
    },
  },
]
```

当配合[嵌套路由](https://router.vuejs.org/zh/guide/essentials/nested-routes.html)使用时，父路由和子路由都可以使用 `beforeEnter`。如果放在父级路由上，路由在具有相同父级的子路由之间移动时，它不会被触发。例如：

js

```js
const routes = [
  {
    path: '/user',
    beforeEnter() {
      // ...
    },
    children: [
      { path: 'list', component: UserList },
      { path: 'details', component: UserDetails },
    ],
  },
]
```

示例中的 `beforeEnter` 在 `/user/list` 和 `/user/details` 之间移动时不会被调用，因为它们共享相同的父级路由。如果我们直接将 `beforeEnter` 守卫放在 `details` 路由上，那么在这两个路由之间移动时就会被调用。

\> 组件内的守卫

```VUE
\<script\>
export default {
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
    // 不能获取组件实例 `this` ！
    // 因为当守卫执行时，组件实例还没被创建！
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
    // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
    // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  },
}
\</script\>
```

**完整的导航解析流程**

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

新增了两个组合式函数，作为导航守卫

```vue
\<template\>
    \<div\>
        \<h1 @click="go"\>我是about\</h1\>
    \</div\>
\</template\>

\<script setup\>
import { useRoute, useRouter,onBeforeRouteLeave,onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteLeave((to,from)=\>{
    console.log(99,to,from)
})
onBeforeRouteUpdate((to,from)=\>{
    console.log("更新了",to,from)
})
\</script\>

\<style lang="scss" scoped\>

\</style\>
```

## 13.路由元信息

路由元数据（meta fields）提供了一种灵活的方式来附加自定义信息到路由对象上。这些信息随后可以在路由守卫、组件内或视图中被访问和使用，从而实现基于路由的权限控制、面包屑生成、标题管理等功能。



默认拿到你访问路由的meta信息，

如果是嵌套路由，可以在matched里获得

```js
import { createRouter,createWebHashHistory } from "vue-router";
import Home from "@/components/Home.vue";
import About from "@/components/About.vue"
const routes = [
    { path: '/', component: Home ,name:"home"},
    { 
      path: '/about', component: About,meta:{msg:"about"},
      children:[
        {
          path:"aa",component:()=\>import("@/components/HelloWorld.vue"),meta:{msg:"about3"}
        }
      ]
    },
  ]
  
let vueRouter=createRouter({
    routes,
    history: createWebHashHistory(), 
})
vueRouter.beforeEach((to, from) =\> {

 console.log(to.meta)
})

export default vueRouter
```

## 14.动态路由

这里是一个简单的示例，展示如何使用 `addRoute()` 方法：

```js
import { createRouter, createWebHistory } from 'vue-router';

const Home = () =\> import('@/components/Home.vue');
const About = () =\> import('@/components/About.vue');

const routes = [
  { path: '/', name: 'Home', component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Dynamically add the About route
router.addRoute({ path: '/about', name: 'About', component: About });Copy
```

#### 条件性添加路由

通常情况下，添加路由可能依赖于应用程序的某些状态，例如用户登录后：

```js
function addAdminRoutes() {
  const AdminPanel = () =\> import('@/components/AdminPanel.vue');
  const UserList = () =\> import('@/components/UserList.vue');
  
  router.addRoute({ path: '/admin', name: 'Admin', component: AdminPanel });
  router.addRoute({ path: '/users', name: 'Users', component: UserList });
}

if (user.isLoggedIn && user.isAdministrator) {
  addAdminRoutes();
}Copy
```

#### 向存在的命名路由添加子路由

你还可以向已有的命名路由添加子路由。例如，将子路由添加到一个名为 `Account` 的父路由：

```js
const UserSettings = () =\> import('@/components/UserSettings.vue');
const UserOrders = () =\> import('@/components/UserOrders.vue');

router.addRoute('Account', { path: 'settings', name: 'Settings', component: UserSettings });
router.addRoute('Account', { path: 'orders', name: 'Orders', component: UserOrders });
```



## 15.



## 查看现有路由



Vue Router 提供了两个功能来查看现有的路由：

- [`router.hasRoute()`](https://router.vuejs.org/zh/api/interfaces/Router.html#Methods-hasRoute)：检查路由是否存在。
- [`router.getRoutes()`](https://router.vuejs.org/zh/api/interfaces/Router.html#Methods-getRoutes)：获取一个包含所有路由记录的数组。

# 19.pinia

Pinia 最初是在 2019 年 11 月左右重新设计使用 Composition API 。从那时起，最初的原则仍然相同，但 Pinia 对 Vue 2 和 Vue 3 都有效，并且不需要您使用组合 API。

pinia



## 1.安装

```
npm install pinia
```



## 2.基本用法

==main.js==

```js
import { createApp } from 'vue'
import App from './App.vue'
import "./mock/index"
import router from "./router/index"
import { createPinia } from 'pinia'
//创建pinia实例
const pinia = createPinia()
//挂载到根实例
createApp(App).use(router).use(pinia).mount('#app')

```

或者如下写法也可以：

![image-20230823145427639](/vue3/image-20230823145427639.png)

## 3.创建store

\> 创建store

- `defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象。

- `state` 是 store 的数据 (`data`)，`getters` 是 store 的计算属性 (`computed`)，而 `actions` 则是方法 (`methods`)。

\> 1.**Option Store**

*src-store-index.js*

```js
import { defineStore } from 'pinia'
//1.定义store
export const useStore=defineStore("main",{ //第一个参数是应用程序中 store 的唯一 id,
    state: () =\> { //// 推荐使用 完整类型推断的箭头函数
        return {
            num:0
        }
      },
    getters:{},
    actions:{}
})
```

\> 2.**Setup Store**

```js
export const useCounterStore = defineStore('counter', () =\> {
  const count = ref(0)
  const doubleCount = computed(() =\> count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }//和组件中的setup一样，必须写返回值
})
```

在 *Setup Store* 中：

- `ref()` 就是 `state` 属性
- `computed()` 就是 `getters`
- `function()` 就是 `actions`

\> 关于store的定义

你可以定义任意多的 store，但为了让使用 pinia 的益处最大化 (比如允许构建工具自动进行代码分割以及 TypeScript 推断)，**你应该在不同的文件中去定义 store**。

## 3.使用数据

**注意事项：**

- store 是一个用 reactive 包装的对象，这意味着不需要在 getters 后面写 .value
- 像 setup 中的 props 一样，我们不能对它进行解构，解构之后不是响应式的

==App.vue==

```vue
\<template\>
   \<h1\>hello vue3\</h1\>
   \<h1\>{{ store.num }}\</h1\>
   
\</template\>
\<script setup\>
import { useStore } from './store';

const store=useStore();
console.log(store.num)
\</script\>

```

## 4.storeToRefs()

为了从 store 中提取属性时保持其响应性，你需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```vue
\<script setup\>
import { storeToRefs } from 'pinia'
const store = useCounterStore()
// `name` 和 `doubleCount` 是响应式的 ref
// 同时通过插件添加的属性也会被提取为 ref
// 并且会跳过所有的 action 或非响应式 (不是 ref 或 reactive) 的属性
const { name, doubleCount } = storeToRefs(store)
// 作为 action 的 increment 可以直接解构
const { increment } = store
\</script\>
```

## 4.修改数据

pinia的数据可以直接改

```vue
\<template\>
   \<h1\>hello vue3\</h1\>
    \<h1 @click="change"\>{{ store.num }}\</h1\>
   
\</template\>
\<script setup\>
import { useStore } from './store';

const store=useStore();
function change(){
  store.num++
}
console.log(store.num)
\</script\>
```

对象形式的数据也可以直接改

```vue
\<!-------------------------store ---------------------\>
export const useStore=defineStore("main",{
    state: () =\> {
        return {
            num:0,
            obj:{
                name:"小明",
                age:18,
                like:["篮球","足球"]
            }
        }
      },
    getters:{
        double(state){return state.num*2}
    },
    actions:{}
})
\<!-------------------------------\>
\<template\>
  \<h1\>hello vue3\</h1\>
  \<h1 @click="change"\>{{ store.num }} {{ store.obj }}\</h1\>
  \<button @click="reset"\>重置\</button\>
\</template\>
\<script setup\>
import { useStore } from './store';

const store = useStore();

let {num}=store

function change() {
 store.obj.like[0]="小红"
}

function reset() {
  store.$reset()
}
console.log(store.num)
\</script\>
```



如果想直接修改多个数据，可以使用`$patch` 方法批量修改

```js
function change() {
 store.$patch({
  num:++store.num,
  obj:{...store.obj,name:"小红"}
 })
}
```

但是上面写法可能麻烦，$patch还接受一个函数当参数

```js
function change() {
 store.$patch((state)=\>{
   state.num++;
   state.obj.name="小红"
 })
}
```

## 5.重置数据

```vue
\<template\>
  \<h1\>hello vue3\</h1\>
  \<h1 @click="change"\>{{ store.num }}\</h1\>
  \<button @click="reset"\>重置\</button\>
\</template\>
\<script setup\>
import { useStore } from './store';

const store = useStore();
function change() {
  store.num++
}

function reset() {
  store.$reset()
}
console.log(store.num)
\</script\>
```



## 6.使用actions修改数据

==store-index.js==

```js
import { defineStore } from 'pinia'
//1.定义store
export const useStore=defineStore("main",{
    state: () =\> {
        return {
            num:0,
            obj:{
                name:"小明",
                age:18,
                like:["篮球","足球"]
            }
        }
      },
    getters:{
        double(state){return state.num*2}
    },
    actions:{
        changeFn(){ //注意不能使用箭头函数定义，
            this.num++;
            this.obj.name="小强"
            /*this.$patch((state)=\>{
                state.num++;
                state.obj.name="小红555"
              })
              也可以这样写
            */
        }
    }
})
```

==App.vue==

```vue
\<template\>
  \<h1\>hello vue3\</h1\>
  \<h1 @click="change"\>{{ store.num }} {{ store.obj }}\</h1\>
  \<button @click="reset"\>重置\</button\>
\</template\>
\<script setup\>
import { useStore } from './store';

const store = useStore();

let {num}=store

function change() {
  store.changeFn()
}

function reset() {
  store.$reset()
}
console.log(store.num)
\</script\>
```



## 7.getters

```js
 getters:{
        double(state){return state.num*2}
    },
 //访问
  console.log(store.double)      
```

如果要访问其他getters

```js
 getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2
    },
    // 返回类型必须明确设置
    doublePlusOne(): number {
      return this.doubleCount  * 2 + 1
    },
  },
```

