# HUSTAU 场地借用系统
## 后台管理 开发文档

### 1 新捅的篓子

+ **[WeUI for 小程序](https://github.com/Tencent/weui-wxss)** 
  因为懒得实现badge等奇奇怪怪的东西，引入了这个东西，路径是 [`miniprogram/assets/weui.wxss`](./miniprogram/assets/weui.wxss) 。虽然是腾讯爸爸自己写的UI，但是毕竟是框架，还是要专门去看 [Demo](https://weui.io/) 学习学习的，有闲功夫的都可以来学学啊，组件挺多的!  
  引入 `WeUI` 只需在 `wxss` 里面加 :

```wxss
    @import "PATHTOROOT/assets/weui.wxss";
    /* PATHTOROOT => the path of miniprogram */
```

### 2 本组负责的页面

 Page         |   Description
------------- | ------------------
 admin        | [alpha] 后台管理的主页面
 listApproval | [alpha] 列出符合条件的所有审批，计划是每次访问传进来查询条件，比如`未审批`, `已审批 && 一个月内` 等。 用到 `WeUI` 里面的 `Preview` 模块。
 viewApproval | [alpha] 显示单个的审批， 即 借用信息 + 活动信息 + 审核情况（同意也需要有审批意见；审批意见可反复修改?） + 操作按钮(同意/拒绝等)) 。 如果是已审批项目，考虑将按钮功能设置为 撤回 （需组织研究决定）。 用到 `WeUI` 里面的 `List`, `Feedback` 中的部分。 

### 3 DB

有几个问题:

0. 没有审批编号，在访问单个表单项时只能使用 `_id` / `_openid` 索引，写起来很难受，应该加审批编号(2019XXXXXX)。
0. `done` 字段意义不明，表示是否完成审批？而且本人认为 `Boolean` 类型欠佳，最少需要表示如下状态： 未审批 / 通过 / 已通过 (/已阅，待审批)，认为可以使用整数或者enum。
0. 缺少社团负责人的联系方式字段(如`pull request #1` 中的 `tel` 字段)，社联审批人信息字段（这个可以不急）。
0. 希望教室编号可以单独加个选择器，避免申请时选错教室。

### 4 License

[The MIT License](http://opensource.org/licenses/MIT)

如果你有好的意见或建议, new issue!!