# HUSTAU 场地借用系统
## 后台管理 开发文档

### 1 新捅的篓子

+ **[WeUI for 小程序](https://github.com/Tencent/weui-wxss)** 
  因为懒得实现badge等奇奇怪怪的东西，引入了这个东西，路径是 [`miniprogram/assets/weui.wxss`](./miniprogram/assets/weui.wxss) 。虽然是腾讯爸爸自己写的UI，但是毕竟是框架，还是要专门去看 [Demo](https://weui.io/) 学习学习的，有闲功夫的都可以来学学啊，组件挺多的!  
  想要引入的话直接在你的 `wxss` 里面加一句 :

```wxss
    @import "PATHTOROOT/assets/weui.wxss";
    /* PATHTOROOT => the path of miniprogram */
```

### 2 本组负责的页面

 Page         |   Description
------------- | ------------------
 admin        | 后台管理的主页面
 listApproval | [pre] 列出符合条件的所有审批，计划是每次访问传进来查询条件，比如`未审批`, `已审批 && 一个月内` 等。 可能用到 `WeUI` 里面的 `Preview` 模块。
 viewApproval | [pre] 显示单个的审批， 即 展示表单项目 + 审核意见（同意也需要） + 是否同意（按钮） 。 如果是已审批项目，考虑将按钮功能设置为 更正/撤回 （需组织研究决定）。 可能用到 `WeUI` 里面的 `Input`, `Feedback` 中的部分。 

### 3 License

[The MIT License](http://opensource.org/licenses/MIT)

如果你有好的意见或建议, new issue!!