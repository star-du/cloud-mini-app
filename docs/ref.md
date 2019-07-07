# Reference Page

## 风格指南 style guide
### JavaScript convention
- 对于identifier (变量和函数名) 使用camelCase e.g.:`onLoad`
- 全局变量和常量用UPPERCASE e.g.
```js
  const PAGE = this
```
- 运算符前后加空格，如 ( = + - * / ), 逗号之后也要有空格 e.g.:
```js
  var values = ["Volvo", "Saab", "Fiat"];
  var person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};  
```

For more, read style guide by [w3schools](https://www.w3schools.com/js/js_conventions.asp).

### JavaScript code example
```js
// Class Foo
var Foo = {

  name: "Foo",
  _hidden_name: "hidden",

  /**
   * Prints out numerous `bar`s
   *
   * @author        smdsbz@GitHub.com
   *
   * @param {String} bar    The string to display.
   *                It's ment to be displayed multiple times.
   * @return       Nothing
   */
  printBars: function (bar) {       // camelCaseNaming in js
    for (let times = bar.length;
          times > 0; --times) {     // smdsbz: 4 more spaces than next
                                    //         indentation level
      console.log("First display: " + bar + ";"
                  + "Second display: " + bar);
    }
  }

};
```
----------------------------------------
## If you're stuck, check these out...
踩过的坑，和一些之前不熟悉的usages
(欢迎补充)

### @author star-du 
JS 中 `&`和`&&`是不同的：
- 一个&表示运算符按位与，就是把两个二进制数按每一位比较，两个都为1则为1，否则为0
- 两个&类似“短路与”，当左边真，返回右侧表达式的值，当左边假，返回左侧表达式的值，右侧不执行     
e.g.
```js
var a = 1
var b = '2'
a && b // return 2
a & b // return 0 
```

JS中箭头函数和普通函数的一个区别：
箭头函数会捕获其所在上下文的 `this`，作为自己的 `this` 值       
用到this时需要注意

WXML/HTML 中属性均需在双引号内
e.g.
```html
<view disabled="{{true}}"> </view>
<!--注：若无需动态绑定，也可以使用：-->
<view disabled> </view>
```
另外，动态绑定还可以用三元运算
```html
<view hidden="{{flag ? true : false}}"> Hidden </view>
```
see [docs](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/data.html)

Q: js promise 如何获取返回值？    
A：promise只能传递值，但是却**不能返回值**。    
也就是说，通过then连接起来的每一步操作，是可以接收到上一步产生的值的，但是这个值，在外面是接收不到的。你想要利用这个异步操作产生的值，要么用then把你的操作串起来，要么设定个全局变量来接收你这个值。    
来自 [思否](https://segmentfault.com/q/1010000007889310)