# HUSTAU 场地/物资借用系统
## 场地借用管理 开发文档

## 1 WeUI

+ [WeUI for 小程序](https://github.com/Tencent/weui-wxss)
+ [WeUI demo](https://weui.io/)
  因为懒得实现badge等奇奇怪怪的东西，引入了这个东西，路径是 [`miniprogram/assets/weui.wxss`](../miniprogram/assets/weui.wxss) 。虽然是腾讯自己写的UI, 但是毕竟是个框架, 不是随心所欲就能用的, 还是要专门去看 Demo 学习学习的.  
+ **引入** `WeUI` 只需在 `wxss` 中添加 :

```wxss
@import "PATH/assets/weui.wxss";
/* PATH : path to miniprogram */
```

+ 貌似flex的渲染因手机和微信版本有所不同, 一定要注意 `WeUI` 在各型号各系统中的表现!! 至少在你的测试设备上不要有问题. [千万不要用 **微信内测版** !!]

## 2 icons

+ [Free vector icons `flaticon.com`](https://www.flaticon.com/)
+ [IcoMoon App `icomoon.io`](https://icomoon.io/app)
+ [Icons - Material Design `material.io/tools/icons`](https://material.io/tools/icons/?style=baseline)


## 3 js-xlsx

+ [SheetJS js-xlsx](https://github.com/SheetJS/js-xlsx)
+ [xlsx - docs](https://docs.sheetjs.com/)
+ **引入** (使用`node_modules`)

0. 在 `package.json` 中添加依赖:

 ```json
 {
      "dependencies": {
          "xlsx":">=0.13.0"
      }
 }
 ```

1. 在 `js` 中链接库:

 ```js
    const XLSX = require("xlsx");
 ```

+ **文档** 参见 [jsXlsx.md](./jsXlsx.md)

## 4 内容

### 4.1 Pages

#### A. facilities/*
0. facilities/index
  主界面 : 借用查询 + 申请场地借用 + 后台管理 的入口, 图标和按钮样式最好由媒体部救救孩子。

0. **facilities/borrowClassroom**
  借用表单的填写页面, 需要完善错误消息提醒机制. 准备写一个表单类(目前一个表单的话直接开一个对象就行), 用来控制表单的读取、数据库操作和信息反馈,并在此列写方法接口.

0. **facilities/listBorrow**
  为之前的公告板界面, 现在集成为一个查询界面. 这个界面的问题较多, 目前设想是做成超级课表之类的UI, 查询使用华中大微校园中课表的查询方式(左右箭头换周次/日期), 然后每个借用可以点开, 弹出框内显示详细信息.

#### B. approval/*

0. **approval/listApproval**

  列出符合条件的所有审批, 访问时传入查询条件, 比如`未审批`, `已审批 && 一个月内` 等. 用到 `WeUI` 里面的 `Preview` 模块. 

0. approval/viewApproval

  显示单个的审批, 即 借用信息 + 活动信息 + 审核情况（同意也有审批意见; 审批意见可反复撤回/修改） + 操作按钮(同意/拒绝/撤回). 用到 `WeUI` 里面的 `List` 中的部分.

0. **approval/exportApproval**

  导出一定时段内的所有审批, 导出为`xlsx`.

#### C. progressCheck


### 4.2 Component

0. common/rulePanel
  带过渡的 `注意事项及申请流程` 折叠面板, 使用的是 `CSS3` 的过渡效果。


### 4.3 Cloud Functions

0. login
   登录查询，返回 `openid` 等信息，管理员有字段 `isAdmin`.

0. **updateApproval**

  [in] `{updateID, check, exam}`

  用于 `viewApproval` 中更新审批情况. `updateID` : 要修改的 `doc` 的字段 `_id`. 返回一个对象 `{error: Boolean, msg: String [, updated : Number]}`, 若调用成功则 `error` 为 `true` 且有 `updated`, 若失败则 `error` 为 `false` 且 `msg` 为错误信息, 无 `updated` 属性.

0. **exportXlsx**

  [in] `{openID, startDate, endDate}`

  生成 `xlsx` 文件, 需要检查 `openid` 是否为管理员(有权限导出). 导出内容为 startDate 至 endDate 内所有的审核通过的审批.


## 5 下一步

0. 用户借用界面**急需**添加教室借用冲突检查，避免提交已提交或者他人以借用房间。
0. `submitDate` 可以使用 [`db.serverDate`](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/db.serverDate.html) API，因为客户端时间和格式可能与服务端有差距，而且该API提供了额外字段，参见 [数据类型文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database/data-type.html)。
0. 整合场地借用内容，预留物资借用页面。
0. 所有人注意阅读 `prd` , **落实一期内容**完成情况, 设计二期内容。

## 6 License

[The MIT License](http://opensource.org/licenses/MIT)

如果你有好的意见或建议, new issue plz!!