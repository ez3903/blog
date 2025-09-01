# this 指向问题

## 普通函数

普通函数的 this 指向，谁调用指向谁(非严格模式)，

- 以函数式调用，指向 windows/global fn() // 不管是不是在方法内
- 以方法式调用，谁调用指向谁 obj.fn()

```js
function fn(){
    console.log(this)  // window/global   --- 严格模式下为undefind
}
setTimeout(function(){
    console.log(this)  // window/global    --- 严格模式下为undefind
},1000)
const btn = document.querySelector('button').addEventListener('click',function(){
    console.log(this)   // btn
})
const obj = {
    say: function(){
        console.log(this)
    }
}
obj.say() // obj

let obj = {
    say(){
        fn(){
            console.log(this)
        }
        fn() // window/global  --- 严格模式下为undefind
    }
}

obj.say() // fn中打印的this是window/global    --- 严格模式下为undefind

```

## 箭头函数

箭头函数中不存在 this,不受调用方式的影响

- 箭头函数会默认帮我们绑定外层 this 的值，所以箭头函数中 this 的值 === 外层的 this 是一样的
- 箭头函数中的 this 引用的就是最近作用的 this
- 向外层作用域中，一层层查找 this，直到有 this 的定义

```js
const uesr = {
  name: "小明",
  age: 12,
  walk() {
    const fn = () => {
      console.log(this);
    };
    fn();
  },
  talk: () => {
    console.log(this);
  },
};
uesr.walk(); // fn中this指向user   fn是箭头函数，与谁调用无关，fn的外层就是walk,walk所在的对象就是user
user.talk(); // talk中this指向window/global, talk是箭头函数，talk的外层是user,user所在的对象在全局

const btn = document.querySelector("button");
btn.addEventListener("click", () => {
  console.log(this); // window/global   箭头函数的外层是定义btn.addEventListener所在，btn所在对象是全局
});
```

## 闭包中

```js
(function () {
  console.log("this", this); // window/global  --- 严格模式下为undefind
})();

(() => {
  console.log("this--", this); // 不管是否在严格模式下，都是window/global
})();
```

## 改变 this 指向

3 个方法（this 指向第一个参数代表的对象）

fn(arg1,arg2)

- call 改变 this 指向的同时，调用函数 fn.call(obj,arg1,arg2)
- apply 改变 this 指向的同时，调用函数 fn.apply(obj,[arg1,arg2]) 第二个参数是参数数组
- bind 改变 this 指向，生成改变 this 指向后的新函数 fn.bind(obj,arg1,arg2)

```js
function fn(a,b){
    console.log(this.name + a + b))
}

let obj = {
    name: 'xx'
}

fn.call(obj,1,2)   // xx12
fn.apply(obj,[1,2])  // xx12
let newFn = fn.bind(obj)
newFn(1,2)  // xx12
```

## react 中 this 指向问题

在 react 中，this 指向问题，一般是指在事件处理函数中，this 指向的问题。

- 类组件中，存在 this 指向问题

  ```js
  class App extends React.Component{
    constructor(props){
      super(props)
    }
    render(){
      return (
        <div>
          <button onClick={this.handleClick}>点我</button>
        </div>
      )
    }

    handleClick(){
      console.log(this)  // undefined  --- 严格模式下
    }

    // 解决办法：
    // 1. 箭头函数
    // 2. bind
    handleClick2 = () =>{
      console.log(this)     // App实例
    }
    let handleClick1 = handleClick.bind(this)  // App实例
  }
  ```

- 函数组件中，不存在 this 指向问题，虽然 this 指向的是 undefined，但是为我们不需要使用 this，我们通常可以直接使用函数中的变量或方法

  ```js
  function App() {
    const name = "xx";
    function handleClick() {
      console.log(this); // undefined
    }
    return (
      <div>
        <button onClick={handleClick}>点我</button>
      </div>
    );
  }
  ```
