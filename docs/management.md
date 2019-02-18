# HUSTAU 场地借用系统
## 后台管理 开发文档

### 1 新捅的篓子

+ **[WeUI for 小程序](https://github.com/Tencent/weui-wxss)** 
  因为懒得实现badge等奇奇怪怪的东西，引入了这个东西，路径是 [`miniprogram/assets/weui.wxss`](./miniprogram/assets/weui.wxss) 。虽然是腾讯爸爸自己写的UI，但是毕竟是框架，还是要专门去看 [Demo](https://weui.io/) 学习学习的，有闲功夫的都可以来学学啊，组件挺多的!  
  引入 `WeUI` 只需在 `wxss` 里面加 :

```wxss
    @import "PATH/assets/weui.wxss";
    /* PATH => the path of miniprogram */
```

+ [Free vector icons `flaticon.com`](https://www.flaticon.com/), [IcoMoon App `icomoon.io`](https://icomoon.io/app), [Icons - Material Design `material.io/tools/icons`](https://material.io/tools/icons/?style=baseline)

### 2 本组负责的内容

 Page         |   Description
------------- | ----------------------
 admin        | 后台管理主页面
 listApproval | 列出符合条件的所有审批，访问时传入查询条件，比如`未审批`, `已审批 && 一个月内` 等。 用到 `WeUI` 里面的 `Preview` 模块。
 viewApproval | 显示单个的审批， 即 借用信息 + 活动信息 + 审核情况（同意也需要有审批意见；审批意见可反复修改） + 操作按钮(同意/拒绝/撤回)。 用到 `WeUI` 里面的 `List` 中的部分。 

 Cloud Function | Input Object            | Description
---------------:| ----------------------- | ----------------------------------
 updateApproval |`{updateID, check, exam}`| 用于 `viewApproval` 中更新审批情况, 其中 `updateID` 表示要修改的 `doc` 的字段 `_id`. 返回一个对象 `{error: Boolean, msg: String [, updated : Number]}`, 若调用成功则 `error` 为 `true` 且有 `updated`, 若失败则 `error` 为 `false` 且 `msg` 为错误信息, 无 `updated` 属性.

### 3 DB

上一次pull的问题基本都有所解决。但仍有几个小问题 :

0. `submitDate` 可以使用 [`db.serverDate`](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/db.serverDate.html) API，因为客户端时间和格式可能与服务端有差距，而且该API提供了额外字段，参见 [数据类型文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/data-type.html)。
0. 请各组注意阅读 `prd` , 落实内容的完成。

### 4 License

[The MIT License](http://opensource.org/licenses/MIT)

如果你有好的意见或建议, new issue!!