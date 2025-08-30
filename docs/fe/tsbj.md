<!-- 纯 Markdown 文件，无 Vue 组件内容 -->

# TypeScript 笔记

## 1. 基础类型

```ts
// 原始类型
let str: string = "hello";
let num: number = 123;
let bool: boolean = true;
let undef: undefined = undefined;
let nul: null = null;
let sym: symbol = Symbol();
let big: bigint = 123n;
```

> 注意：使用 `symbol` 时，需要在 `tsconfig.json` 中将 `target` 设置为 **ES6+**，使编译器按照 es6+方式编译。

## 2. 特殊类型

```ts
// any：不安全，尽量避免
let a: any = 1;
a = "word";

// unknown：比 any 更安全，需类型判断
let b: unknown = 5;
if (typeof b === "number") {
  console.log(b * 2);
}

// never：不会有返回值（抛错 / 死循环）
function fn(): never {
  throw new Error("error");
}

// 字面量类型
let c: "hello" = "hello";
```

## 3. tsconfig.json 常用配置

```json
{
  "compilerOptions": {
    // 编译器选项，指定编译器行为
    "target": "es2015", // 编译后 JS 版本（js代码要符合的ECMAScript版本）
    "module": "ES2015", // 模块系统，指定TS代码使用的模块系统
    "strict": true, // 严格模式
    "outDir": "./dist", // 输出目录
    "sourceMap": true // 是否生成 源码映射文件
  },
  "include": ["src/**/*"], // 编译范围
  "exclude": ["node_modules"] // 排除目录
}
```

> 其他：
>
> - baseUrl 和 paths 配置 Ts 的模块解析规则，指定模块的基础路径和路径别名
> - references 指定要引用的其他 TS 项目，通过引用其他项目，可以在一个项目中使用另一个项目的类型定义文件
> - files 手动指定要编译的文件列表，如果指定了 files,则编译器只会对这些文件进行编译，不会考虑 include 和 exclude

## 4. 数组与元组（tuple）

```ts
// 数组主要用来存相同类型数据（虽然可以存不同类型数据，不推荐）
let arr: string[] = ["a", "b"];
let matrix: string[][] = [
  ["1", "2"],
  ["3", "4"],
]; // 二维数组

// 元组：存不同类型数据
let tuple: [string, number, boolean] = ["1", 1, true];
tuple.push("3"); // 元组可追加，但只能是元组定义时的联合类型

// 泛型声明数组
let list: Array<number> = [1, 2, 3];
```

## 5. 对象

```ts
// 基本对象
let obj: { age: number; name: string } = { age: 12, name: "小李" };
obj.gender = "男"; // ❌ 添加类型声明之外的属性不允许

// 可选属性
let obj2: { age?: number; name: string };

// 任意属性（必须兼容已有属性类型）
let obj3: { name: string; [key: string]: string } = {
  name: "张三",
  gender: "男",
};
let a: { name: string; [propName: string]: number }; // ❌ 任意属性类型number不兼容前面的string

// 只读属性
let obj4: { readonly name: string } = { name: "小张" };

// 对象数组
let users: { name: string; age: number }[] = [{ name: "xiaoli", age: 2 }];

// 内置对象   --- 了解即可
let b: Boolean = new Boolean(1);
let e: Error = new Error("error");
let d: Date = new Date();
let r: RegExp = /[a-z]/;
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll("div");
```

## 6. 函数

```ts
// 参数和返回值
function sum(a: string, b: number): string {
  return a + b
}

// 无返回值
function log(): void {
  console.log('hello')
}

// 函数类型声明
let fn: (a: number) => void = (a) => console.log(a)

// 可选参数（必须在最后）
function greet(name?: string) {}

// 剩余参数
function join(a: number, ...rest: string[]) {}

// 函数数组
let fnArr: (() => number)[] = [() => 123]

// 函数返回值为函数
function fn(a:number,b:string):(b:string)=>string{
    return (b:string)=>{console.log('b');return b}
}

// never类型
function fn(a,b):never{
    throw new Error('error')
    console.log(123)
}
function fn(a,b):never{
    while(true){
        ...
    }
    console.log(123)
}

```

> 函数声明和赋值分开时，函数的实际参数个数，可以少于类型指定的参数个数 ，例如数组的 forEach 方法的参数是一个函数该函数默认有三个参数（item,index,array)=>void,但很多时候我们只使用一个（item)=>void。但如果我们声明并赋值之后，函数调用必须按照类型定义

## 7. 联合类型 & 类型别名

```ts
let value1: string | number = "hello";
let value2: (string | number)[] = [1, "2"];

function fn(a: string | number): void {
  // a.substring()  ❌，如果不确定的话，不能用他两不共有的属性或者方法
  a.toString(); // 这个可以
}

let a: string | number | boolean; //  联合类型不限制个数

// 类型别名

// 太麻烦了，类型多次声明，而且重复了
let obj: { name: string; age: number; hobby: string[]; run: () => void } = {...};
let obj2: { name: string; age: number; hobby: string[]; run: () => void } = {...};
let obj3: { name: string; age: number; hobby: string[]; run: () => void } = {...};

type myObj = { name: string; age: number; hobby: string[]; run: () => void };

let obj4: myObj = {...};
let obj5: myObj = {...};
let obj6: myObj = {...};
```

## 8. 类型推论

```ts
let a = 1;
a = "2"; // ❌ 推断为 number
```

## 9. typeof & keyof

```ts
// js中 typeof 运算符只能返回八种结果
typeof "foo"; //'string'
typeof 1337; //'number'
typeof true; //'boolean'
typeof undefined; //'undefined'
typeof Symbol(); //'symbol'
typeof {}; //'object'
typeof parseInt; //'function'
typeof 127n; //'bigint'

// ts中 typeof 返回的是该值的TS类型
const obj = { x: 0 };
type T = typeof obj; // { x: number }
// 工作中实际场景 -- 定义一个类型不确定，但是和某个不确定的类型一样
let a = {...};
type C = typeof a;
let b: C = {...};

//keyof接收一个对象类型作为参数，返回该对象的所有键名组成的联合类型
type Person = { name: string; age: number };
type Keys = keyof Person; // "name" | "age"
let key: Kyes = "name";
```

## 10. 映射类型（了解）

```ts
// 映射类型只能在类型别名中使用，不能在接口中使用

type Keys = 'x'|'y'|'z'
type MyType={x:number,y:number,z:number}

// 思考如何优化上面   in 后面 接 联合类型， 也可以是keyof 之后的类型（也是联合类型）
type MyType = {[key in Keys]:number}  // 等同于上面

type Props = {a:number,b:string,c:boolean}
type MyType = {[key in keyof Props]:string} // {a:string,b:string,c:string}
type MyType = {[key in keyof Props]:Props[key]} {a:number,b:string,c:boolean}
```

## 11. 接口（interface）

```ts
// 接口主要用来定义对象类型
interface Person {
  readonly name: string
  age: number
  hobby?: string[]
}
let p: Person = {name:'xiaoli',age:12}

// 接口继承
interface Girl extends Person {
  height: number
}

// 多继承
interface Boy { love: boolean }
interface RichBoy extends Person, Boy {
  salary: number
}

// 若要实现接口，必须实现接口接口以及所有被继承接口定义的类型

// 同名接口会合并
interface if1 { name: string }
interface if1 { age: number }
let xl:if1 = { name: 'xiaoli', age: 18 }

// 接口也可以定义数组和函数,但是不推荐
interface MyArry{
    [index:number]:string
}
let arr = ['1','2']
interface MyFn{
    (a:number):number
}
let fn:MyFn = (a:number) => {return 123}

// 接口不支持映射
interface Point{
    x: number;
    y: number;
}
type Person1 = {
    [key in keyof Point]: Point[key];  // ✅
}
interface Person2 {
    [key in keyof Point]: Point[key]; // ❌，会报错
}
```

> 接口和类型别名区别：
>
> - type 能够表示非对象类型，而 interface 只能表示对象类型（包括数组、函数等）
> - interface 可以继承其他类型，type 不支持
> - 同名 interfere 会自动合并，同名 type 则会报错
> - interface 不能包含属性映射，type 可以

## 12. 交叉类型

```ts
// 交叉类型用来定义对象类型
type A = { name: string }
type B = { age: number }
interfaceC {
    weight: number
}
type D = A & B & C & { hobby: string[] }  // 取并集
```

> 交叉类型不要对基本数据使用，或者数组， string & number ❌ 不成立

## 13. 类型断言

```ts
let val: any = "hello";
let len = (val as string).length;

let a: number;
(a as string).length; // ❌  断言的类型必须被声明类型包含

// 可以将任何类型断言为any,或者将any断言为任何类型

// 非空断言
let str: string | null;
let size = str!.length;
```

> 类型断言只能欺骗编译器，让它不报错，无法避免运行时错误，使用断言要谨慎
>
> 另一种断言语法：<类型>值 \<string\>str （不推荐）

## 14. 枚举（enum）

```ts
// enum 用于定义一些有名字的数字变量，当一个元素有固定的几个值可选时，可以使用enum。
enum OrderStatus {
  Transport, // 默认从0开始递增
  Unsign,
  Signed,
}
console.log(OrderStatus.Transport); // 0

// 需要手动赋值的情况, 某些时候希望用一些有含义的数字
enum Status {
  Success = 200,
  NotFound = 404,
  Error = 500,
}

// 枚举值可以可已使用计算值和常量,但其后必须手动赋值
const Num = 100;
const fn = () => 200;
enum E {
  a = Num,
  b = fn(),
  // c, ❌
  c = 300,
}

// 反向映射(只支持数字枚举，value为number)  ---  语法 enumA[value] ，通过值读属性名。
console.log(Status[200]); // "Success"

// 字符串枚举
enum OrderStatus {
  Ok = "请求成功",
  Error = "网络超时",
}
enum Api {
  Detail = "/api/detail",
  List = "/api/order/list",
  User = "/user",
}
```

## 15. 泛型（Generics）

泛型（Generics)是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定，简单来说泛型其实就是类型参数。

```ts
// 形参-定义函数时不指定具体值  实参-调用时指定
fun(a){
    return a + 1
}
fun(100)

// 函数中使用泛型
function identity<T>(arg: T): T {
  return arg
}
identity<string>('hello')

// 接口中使用泛型
interface Box<T> { value: T }
let box: Box<string> = { value: 'hi' }

// 类型别名中使用泛型
type C<T> = {value:T}
let obj:C<string>={value:'hello'}

// 数组定义
let arr:Array<string> = ['1','2']
interface Array<T>{  // Array是ts内置接口
    ...
}

// 类型参数默认值
function fn<T=string>(m:T):T{
    return m
}


// 泛型约束  T extends U (T包含U)
function getLen<T>(arg:T):number{
    return arg.length  // ❌不确定arg有length方法
}
function getLen<T extends { length: number }>(arg: T): number {
  return arg.length
}

// 泛型约束结合keyof
let obj = {a:1,b:2,c:3}
function fn<T extends keyof U,U>(a:T,b:U):void{}
fn('a',obj)

// 泛型嵌套  -- 把带泛型的类型整体看成一个类型
interface Box<T> { itm:T }
interface Person<T> { name:T }
let obj1:Box<Person<string>> = {
    itm: {
        name: 'hello'
    }
}
let obj2:Box<Box<string>> = {
    itm:{
        itm:'hello'
    }
}
```

## 16. 类（class）

```ts
class Person{
    // 实例属性
    name:string   // js中不写这行，ts中不对❌,ts中class类构造函数中用到的所有属性，必须提前定义类型
    constructor(name,age){
        this.name = name;
        this.age = age
    }
    static count:number = 100
    eat(){}
}


// 使用访问修饰符可以简化类中属性定义
class Person {
  constructor(public name: string, public age: number) {}
  static count = 0
  eat() {}
  static sleep() {}
}

// 继承
class Dog extends Person {
  constructor(name: string, age: number, public gender: string) {
    super(name, age)
  }
  eat() {} // 重写
}

// 抽象类
abstract class Animal {
  abstract sound(): void
}
// 抽象类中的方法必须被子类实现（如果子类还是抽象类，不需要实现，但子类不是抽象类必须实现）
class Cat extends Animal {
  sound() { console.log('喵') }
}

// implements关键字   --- 一个类可以同时实现多个接口
interface Person{
    id:number,
    name:string,
    play:()=>void
}
class XiaoMing implements Person{
    id:number
    name:string
    play(){}
    ...
}

// 在类中使用泛型
class Person<T>{
   	constructor(public name:T,public age:number){
        this.name = name
        this.age = age
    }
}
new Person<string>('小明',18)
```

> 访问修饰符：
>
> - public 不加默认就是公有属性或方法, 可以在任何地方被访问到
> - private 私有属性或方法，只能在类内使用，不能在声明它的类（当前类）的外部访问
> - protected 受保护属性或方法，和 private 类似，区别是它可以在当前类和子类中被访问

## 17. 模块化

```ts
// a.js
var a = 1;
// index.html <script src="a.js"></script>

// a.js是模块吗？不是，a.js定义的变量a是全局的，全局可用；模块本身就是一个作用域，不属于全局作用域，模块内部的变量，函数，类只在内部可见；任何包含import 或 export 语句的文件，默认开启模块化，就是一个模块（module），如果不包含，就是一个全局的脚本文件

// a.ts
const str  = '11'
export const num = 1
export type ty1 = typeof num
export type ty2 = typeof num
export default str
export { num,ty1,ty2}  // export { num, type ty1, type ty2 } -- export type { ty1,ty2 }
// b.ts
import str, { num, ty1 } from './a'

// 更优雅写法 type 标识
import str, { num, type ty1 } from './a'
import str, type { ty1, ty2 } from './a'  // 若{}中引入的全是类型，可以将type提到括号外
```

> 重导出：当你的模块如果需要用到好多模块定义的类型，可以单独定义一个文件，把这些模块重导出，那么我们的项目文件只需要引入这一个重导出文件就好了
>
> a.ts export ...
> b.ts export \* from './a' // 这里重导出所有
> c.ts import type {...} from './b'

## 18. namespace(了解)

```ts
// 老旧语法，不推荐，模块化更常用 --- 看到一些古老的第三方库，写这个，知道就行

// index.ts
namespace Utils {
  export function fn() {
    // 如果不加export 只能在命名空间内使用
    console.log(1);
  }
  let a = 1;
  fn();
}
Utils.fn();
```

## 19. declare 与声明文件

```ts
// 主要用于第三方库的类型补充，例如 `@types/lodash`。某些古老第三方插件不是TS写的或者没有TS类型，不能被编译器识别类型，需要手动写描述文件（.d.ts文件，只能描述已经存在的变量和数据结构，不能声明数据类型）

// common.d.ts
declare function fn(a: number, b: number): number;
declare class Person {
  name: string;
}
export { fn, Person };

// your.ts
import { fn } from "./common";
fn(1, 1);
```

> declare 加载方式:
>
> - 同名引入：.js 文件和.d.ts 文件在同一目录下，引入.d.ts 文件时,会自动加载.d.ts 同一目录下 js 文件
> - 自动引入：对于安装第三方库比如 lodash,如果安装了对应的类型声明（@types/lodash)，ts 会自动引入 node_modules/@types 的声明文件，无需显式引入

## 20. 三斜杠指令(了解)

三斜杠指令是一个 TS 的编译器指令，用来指定编译器行为，只能用在文件头部。如果类型声明文件的内容非常多，可以拆分成多个文件，然后入口文件使用三斜杠命令，加载其他拆分后的文件。

```ts
/// <reference path="./interfaces.d.ts" />
/// <reference path="./functions.d.ts" />

/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("https://www.typescriptlang.org");

// typeRoots设置类型模块所在目录，默认是node_modules/@types,该目录里面的模块会自动加入编译
// tsconfig.json
{
    "compilerOptions":{
        "typeRoots": ["./typings","./vendor/types"]
    }
}
```

> 指令解析：

> - `///<reference path=".." />` 告诉编译器在编译时要包含的文件，常用来声明当前脚本依赖的类型文件，编译器会在预处理阶段，找出所有三斜杠引用的文件，将其添加到编译列表中，然后一起编译。
> - `<reference types=".." />` types 参数用来告诉编译器当前脚本依赖某个 DefinitelyTyped 类型库，通常安装在`node_modules/@types`目录， types 参数的值是类型库的名称，也就是安装到`node_modules/@types`目录中的子目录的名字, 类似 import \* from 'node_modules/@types/...',，注意只有在自己手写.d.ts 文件时，才有必要用到。普通的.ts 脚本可以使用 tsconfig.json 文件中的 types 属性指定依赖的类型库
> - `<reference lib=".." />` 安装 TypeScript 软件包时，会同时安装一些内置的类型声明文件，即内置的 lib 库。这些库文件位于 TypeScript 安装目录的`lib`文件夹中，它们描述了 JavaScript 语言和引擎的标准 API。库文件并不是固定的，会随着 TypeScript 版本的升级而更新。库文件统一使用“lib.[description].d.ts”的命名方式，而`/// <reference lib="" />`里面的`lib`属性的值就是库文件名的`description`部分，比如`lib="es2015"`就表示加载库文件`lib.es2015.d.ts`。

## 21. 其他

装饰器语法，import defer 以及 node 方面的，这里只是基础中的基础，学海无涯，奋斗吧少年！

[tsconfig 手册](https://wangdoc.com/typescript/tsconfig.json)

[ts 官方文档](https://www.typescriptlang.org/docs/)
