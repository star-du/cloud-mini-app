# Cloud Functions

云函数配置时需注意:

  + 看环境是开发环境还是运行环境.
  + 注意部署时选择云端安装依赖, 详细的可以了解 `npm` 和 `package.json` 的用法.
  + 调试时可以看云开发环境中的输出信息, 若没有运行显示, 关闭窗口再重开能强制刷新.

## 1. login

登录并查询管理员数据库, 返回用户登录信息.

- 输入: 暂时不需要输入数据
- 返回: Object, 描述如下: 

Name    | Type      | Description
-------:| --------- | ------------------------
openid  | ID String | 用户的 `openid`
unionid | ID String | 用户的 `unionid`(如果有)
isAdmin | Boolean   | 是否为管理员

如果 `isAdmin` 为 `true`, 则还有以下属性:

Name    | Type    | Description
-------:| ------- | ------------------------------------
name    | String  | 数据库中的用户名
isSuper | Boolean | [Todo]是否为超级用户(可以管理管理员)


0. **updateApproval**

  [in] `{updateID, check, exam}`

  用于 `viewApproval` 中更新审批情况. `updateID` : 要修改的 `doc` 的字段 `_id`. 返回一个对象 `{error: Boolean, msg: String [, updated : Number]}`, 若调用成功则 `error` 为 `true` 且有 `updated`, 若失败则 `error` 为 `false` 且 `msg` 为错误信息, 无 `updated` 属性.

0. **exportXlsx**

  [in] `{openID, startDate, endDate}`

  生成 `xlsx` 文件, 需要检查 `openid` 是否为管理员(有权限导出). 导出内容为 startDate 至 endDate 内所有的审核通过的审批.