# this指向问题

## 普通函数

普通函数的this指向，谁调用指向谁(非严格模式)， 

+ 以函数式调用，指向windows/global      fn()  // 不管是不是在方法内
+ 以方法式调用，谁调用指向谁     obj.fn()

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

箭头函数中不存在this,不受调用方式的影响

+ 箭头函数会默认帮我们绑定外层this的值，所以箭头函数中this的值 === 外层的this是一样的
+ 箭头函数中的this引用的就是最近作用的this
+ 向外层作用域中，一层层查找this，直到有this的定义

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
       console.log(this)
   }
};
uesr.walk();  // fn中this指向user   fn是箭头函数，与谁调用无关，fn的外层就是walk,walk所在的对象就是user
user.talk(); // talk中this指向window/global, talk是箭头函数，talk的外层是user,user所在的对象在全局


const btn = document.querySelector('button')
btn.addEventListener('click',() => {
    console.log(this)   // window/global   箭头函数的外层是定义btn.addEventListener所在，btn所在对象是全局
})

```

## 闭包中

```js
(function () {
  console.log("this", this);  // window/global  --- 严格模式下为undefind
})();

(() => {
  console.log("this--", this);  // 不管是否在严格模式下，都是window/global
})();

```

## 改变this指向

3个方法（this指向第一个参数代表的对象）

fn(arg1,arg2)

+ call   改变this指向的同时，调用函数  fn.call(obj,arg1,arg2)      
+ apply  改变this指向的同时，调用函数  fn.apply(obj,[arg1,arg2])    第二个参数是参数数组
+ bind  改变this指向，生成改变this指向后的新函数 fn.bind(obj,arg1,arg2)

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



